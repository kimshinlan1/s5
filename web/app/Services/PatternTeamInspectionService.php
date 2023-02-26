<?php

namespace App\Services;

use App\Common\Constant;
use App\Models\Inspection;
use Illuminate\Http\Request;
use App\Models\PatternDetail;
use App\Models\Team;
use App\Models\InspectionImage;
use App\Models\InspectionDetail;
use App\Models\InspectionImageBlock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManagerStatic as Image;

class PatternTeamInspectionService extends BaseService
{
    /* @var Model */
    private $model;
    private $imageModel;
    private $imageBlockModel;

    private $inspectionImagePath = '';

    public function __construct(PatternDetail $model, InspectionImage $imageModel, InspectionImageBlock $imageBlockModel)
    {
        // todo: update
        $this->model = $model;
        $this->imageModel = $imageModel;
        $this->imageBlockModel = $imageBlockModel;
        parent::__construct($model);
        $this->inspectionImagePath = public_path(Constant::INSPECTION_IMAGE_PATH);
    }

    /**
     * Get list by conditions
     *
     * @param  $id (id of pattern)
     *
     * @return array
     */
    public function getDataTeamById($id)
    {
        return Team::where('id', $id)->get()->toArray();
    }

    /**
     * Returns pattern detail list.
     *
     * @param  id
     * @return array
     */
    public function getPatternDataByDept($deptId)
    {
        $table = 'dept_patterns_details';
        $sql = DB::table("$table")
        ->select([
            'areas.id as area_id',
            'areas.name as area_name',
            'locations.id as location_id',
            'locations.name as location_name',
            "$table.point as 5s",
            "$table.level_1 as level_1",
            "$table.level_2 as level_2",
            "$table.level_3 as level_3",
            "$table.level_4 as level_4",
            "$table.level_5 as level_5",

            DB::raw("(SELECT count(locations.id) FROM locations
            WHERE areas.id = locations.area_id) as count_locations"),

            DB::raw("(SELECT count(pd.id) FROM $table pd
            WHERE pd.dept_pattern_id = $table.dept_pattern_id
            and pd.area_id = $table.area_id) as area_rowspan"),

            DB::raw("(SELECT count(pd2.id) FROM $table pd2
            WHERE pd2.dept_pattern_id = $table.dept_pattern_id
            and pd2.location_id = $table.location_id) as location_rowspan")

        ])
        ->leftJoin('locations', 'locations.id', '=', "$table.location_id")
        ->leftJoin('areas', 'areas.id', '=', 'locations.area_id')
        ->orderBy('areas.id');

        if ($deptId) {
            $sql->join('departments', 'departments.dept_pattern_id', '=', "$table.dept_pattern_id")
                ->where('departments.id', $deptId);
        }

        return $sql->get()->toArray();
    }

    /**
     * Returns inspection detail list.
     *
     * @param  teamId
     * @return array
     */
    public function getInspectionDetailsByTeam($teamId)
    {
        $table = 'inspection_details';
        $sql = DB::table("$table")
        ->select([
            "$table.inspection_id as inspection_id",
            'inspection.inspection_date as inspection_date',
            'areas.id as area_id',
            "$table.location_id as location_id",
            "$table.point as 5s",
            "$table.point_value as point_value",

            DB::raw("(SELECT count(inspection_images.id) FROM inspection_images
            WHERE inspection_images.inspection_id = $table.inspection_id
            ) as count_evidence")
        ])
        ->leftJoin('inspection', 'inspection.id', '=', "$table.inspection_id")
        ->leftJoin('locations', 'locations.id', '=', "$table.location_id")
        ->leftJoin('areas', 'areas.id', '=', 'locations.area_id')
        ->orderBy('inspection.id');

        if ($teamId) {
            $sql->where('inspection.team_id', $teamId);
        }

        return $sql->get()->toArray();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $inspectionId
     * @param int $teamId
     *
     * @return \Illuminate\Http\Response
     */
    public function destroyInspections($inspectionId)
    {
        // Remove inspection
        $data = Inspection::find($inspectionId)->delete();

        // Remove Inspection details
        InspectionDetail::where('inspection_id', $inspectionId)->delete();

        // todo: Remove Inspection images
        // InspectionImage::where('inspection_id', $inspectionId)->delete();

        // todo: Remove all images on disk
        if ($data) {
            // todo: Check exists img in inspectionId (ex: public/uploads/inspections/imgs/{inspectionId}/*)
            // $this->inspectionImagePath;
        }

        return $data;
    }

    /**
     * Save data
     *
     * @param  \Illuminate\Http\Request  $request
     * @return object
     */
    public function saveInspection(Request $request)
    {
        $dataList = $request->get('data');

        // Sample
        // $data = [
        //     0 => [
        //         'info' => [
        //             'team_id' => '',
        //             'inspection_id' => '',
        //             'inspection_date' => '',
        //         ],
        //         'data' => [
        //             '1' => [ // location_id
        //                 's1' => 1,
        //                 's2' => 1,
        //                 's3' => 1
        //             ],
        //             '2' => [ // location_id
        //                 's1' => 1,
        //                 's2' => 1,
        //                 's3' => 1
        //             ],
        //         ]
        //     ]
        // ];


        /**
         * Step: Remove old data
         *
         * Loop data:
         *    Step: Insert new inspection
         *    Step: Insert new inspection_details
         *
         *    Note: array data must be created in valid structure
         *
         */

        foreach ($dataList as $data) {
            $id = is_numeric($data['info']['inspection_id']) ? $data['info']['inspection_id'] : null;

            // Step: todo: Remove old data
            if ($data['info']['inspection_id']) {
                // Remove inspection_details
                InspectionDetail::where('inspection_id', $data['info']['inspection_id'])->delete();

                // Note: Inspection Images doesn't need to remove
            }

            // Step: todo: Insert new
            // $inspectionDate = strtotime($data['info']['inspection_date']);
            // $inspectionDateTime = date('Y-m-d h:i:s', $inspectionDate);
            foreach ($data['data']['pointAvg'] as $locationId => $points) {
                $inspectionId = Inspection::updateOrCreate(
                    [
                        'id' => $id
                    ],
                    [
                        'team_id' => $data['info']['team_id'],
                        'inspection_date' => $data['info']['inspection_date'],
                        'avg_point' => $points,
                    ]
                );
                $inspectionId = $inspectionId->id;
            }

            foreach ($data['data']['details'] as $locationId => $points) {
                // Loop to insert details rows
                foreach ($points as $key => $val) {
                    InspectionDetail::create([
                        'inspection_id' => $inspectionId,
                        'location_id' => $locationId,
                        'point' => $key,
                        'point_value' => $val,
                    ]);
                }
            }
        }

        return true;
    }

    /**
     * Get evidences by inspection id
     *
     * @param int $inspectionId
     *
     * @return object
     */
    public function getEvidenceByInspectionId($id) {
        $blocks = DB::table('inspection_block_images')->orderBy('inspection_block_images.id')->get()->toArray();
        foreach ($blocks as $key => $block) {
            $hasBefore = false;
            $hasAfter = false;
            $id = $block->id;
            $images = DB::table('inspection_images')->where('inspection_images.block_id', $id)->orderBy('inspection_images.id')->get()->toArray();
            $block->images = $images;
            foreach ($images as $key => $image) {
                if ($image->is_before == 1) {
                    $hasBefore = true;
                };
                if ($image->is_before == 0) {
                    $hasAfter = true;
                };
            }
            $block->hasBefore = $hasBefore;
            $block->hasAfter = $hasAfter;
        }
        return $blocks;
    }

    /**
     * Save uploaded Image
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return array
     */
    public function saveUploadedImage(Request $request)
    {
        $blockId = $request->get('block_id');
        $isBefore = $request->get('is_before');
        $countFile = $request->get('count_file');
        // $inspectionId = $request->get('inspection_id');
        $inspectionId = 1;
        $arr = [];
        $imgPath = '';
        if ($blockId && $isBefore != null && $inspectionId) {
            for ($i=0; $i < intval($countFile); $i++) {
                $image = $request->file('file'.$i);
                if (!empty($image)) {
                    $path = $isBefore ?
                    $this->inspectionImagePath . '/inspection' . $inspectionId . '/block' . $blockId . '/before/':
                    $this->inspectionImagePath . '/inspection' . $inspectionId . '/block' . $blockId . '/after/';

                    $imgPath = $isBefore ?
                    Constant::INSPECTION_IMAGE_PATH . '/inspection' . $inspectionId . '/block' . $blockId . '/before/':
                    Constant::INSPECTION_IMAGE_PATH . '/inspection' . $inspectionId . '/block' . $blockId . '/after/';

                    if (!File::exists($path)) {
                        File::makeDirectory($path, 0777, true, true);
                    }
                    $fileName = $image->getClientOriginalName();
                    $isExistedName = $this->imageModel->where('img_name', $fileName)->exists();
                    if ($isExistedName) {
                        $fileName = 'new_' . $fileName;
                    }
                    $location = $path . $fileName;
                    Image::make($image)->save($location);
                } else {
                    return [
                        'invalid' => true,
                    ];
                }
                $data = [
                    'block_id' => $blockId,
                    'inspection_id' => $inspectionId,
                    'img_name' => $fileName,
                    'img_path' => $imgPath .$fileName,
                    'is_before' => $isBefore,
                ];

                $res = $this->imageModel::create($data);
                if ($res) {
                    array_push($arr, $res);
                } else {
                    return [
                        'invalid' => true,
                    ];
                }
            }
        } else {
            return [
                'invalid' => true,
            ];
        }

        return $arr;
    }

    /**
     * Remove one Image in a specific album
     *
     * @param int $id
     *
     * @return object
     */
    public function removeExistingImage($id)
    {
        $img =  $this->imageModel::find($id);
        if ($img) {
            $fileInSourceCode = $img->img_path;
            $file = public_path($fileInSourceCode);
            if (File::exists($file)) {
                File::delete($file);
            }
            if (File::exists($fileInSourceCode)) {
                File::delete($fileInSourceCode);
            }
        }
        return $img->delete();
    }

    /**
     * Add a block
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function addNewBlock(Request $request)
    {
        return $this->imageBlockModel::create($request->all());
    }

     /**
     * Remove a block
     *
     * @param int $id
     *
     * @return object
     */
    public function removeExistingBlock($id)
    {
        $data = DB::table('inspection_block_images')->where('id', $id);
        // $inspectionId = $request->get('inspection_id');
        $inspectionId = 1;
        if ($data) {
            $imageIds = $this->imageModel->where('block_id', $id)->select('id')->get()->toArray();
            $this->imageModel::whereIn('id', $imageIds)->delete();
            $path = $this->inspectionImagePath . '/inspection' . $inspectionId . '/block' . $id;
            $sourcePath = Constant::INSPECTION_IMAGE_PATH . '/inspection' . $inspectionId . '/block' . $id;
            if (File::exists($path)) {
                File::deleteDirectory($path);
            }
            if (File::exists($sourcePath)) {
                File::deleteDirectory($sourcePath);
            }
            $data = $data->delete();
        }
        return $data;
    }

     /**
     * Remove before/after album
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function removeExistingAlbum(Request $request)
    {
        // $inspectionId = $request->get('inspection_id');
        $inspectionId = 1;
        $blockID = $request->get('blockID');
        $isBefore = $request->get('isBefore');
        $ids = $request->get('ids');
        if ($ids) {
            $path = $isBefore == '1' ?
            $this->inspectionImagePath . '/inspection' . $inspectionId . '/block' . $blockID . '/after/':
            $this->inspectionImagePath . '/inspection' . $inspectionId . '/block' . $blockID . '/before/';

            $sourcePath = $isBefore == '1' ?
            Constant::INSPECTION_IMAGE_PATH . '/inspection' . $inspectionId . '/block' . $blockID . '/after/':
            Constant::INSPECTION_IMAGE_PATH . '/inspection' . $inspectionId . '/block' . $blockID . '/before/';

            if (File::exists($path)) {
                File::deleteDirectory($path);
            }
            if (File::exists($sourcePath)) {
                File::deleteDirectory($sourcePath);
            }
            return $this->imageModel::whereIn('id', $ids)->delete();
        }
        return false;
    }
}
