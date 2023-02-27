<?php

namespace App\Services;

use App\Common\Constant;
use App\Models\Inspection;
use Illuminate\Http\Request;
use App\Models\InspectionImage;
use App\Models\InspectionDetail;
use App\Models\InspectionImageBlock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManagerStatic as Image;

class PatternTeamInspectionEvidenceService extends BaseService
{
    /* @var Model */
    private $imageModel;
    private $imageBlockModel;

    private $inspectionImagePath = '';

    public function __construct(InspectionImage $imageModel, InspectionImageBlock $imageBlockModel)
    {
        // todo: update
        $this->imageModel = $imageModel;
        $this->imageBlockModel = $imageBlockModel;
        $this->inspectionImagePath = public_path(Constant::INSPECTION_IMAGE_PATH);
    }

    /**
     * Get evidences by inspection id
     *
     * @param int $inspectionId
     *
     * @return object
     */
    public function getEvidenceByInspectionId($id) {
        $blocks =  $this->imageBlockModel->where('inspection_id', $id)
        ->distinct()->orderBy('inspection_block_images.id')->get();

        foreach ($blocks as $block) {
            $hasBefore = false;
            $hasAfter = false;
            $blockId = $block->id;
            $images = $this->imageModel->where('block_id', $blockId)
            ->where('block_id', $blockId)->orderBy('id')->get();
            $block->images = $images;
            foreach ($images as $image) {
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
        $countLocation = $request->get('countLocation');
        $inspectionId = $request->get('inspection_id');
        $teamId = $request->get('team_id');
        $locations = $request->get('locations');
        $locations = explode(",", $locations);

        if ($blockId && $countFile && $countLocation && $teamId && $locations) {
            // If add evidences for empty inspection, it will create one default inspection for new evidences.
            if (!$inspectionId) {
                $inspectionId = $this->createDefaultInspection($teamId, $locations, $countLocation);
            }

            $arr = [];
            $imgPath = '';
            // Create and save uploaded image
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

            return [
                'imgs' => $arr,
                'inspectionId' => $inspectionId
            ];
        } else {
            return [
                'invalid' => true,
            ];
        }


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
        $inspectionID = $request->get('inspectionId');
        $locations = $request->get('locationArr');
        $teamId = $request->get('teamId');
        $countLocation = count($locations);
        if (!$inspectionID) {
            $inspectionID = $this->createDefaultInspection($teamId, $locations, $countLocation);
        }
        $data = [
            'inspection_id' => $inspectionID
        ];
        return $this->imageBlockModel::create($data);
    }

     /**
     * Remove a block
     *
     * @param int $id
     *
     * @return object
     */
    public function removeExistingBlock($id, Request $request)
    {
        $data = DB::table('inspection_block_images')->where('id', $id);
        if ($request->has('inspectionId')) {
            $inspectionId = $request->get('inspectionId');
        } else {
            return [
                'invalid' => true,
            ];
        }
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
        $inspectionId = $request->get('inspectionId');
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

     /**
     * Save data from the evidence dialog
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function saveData(Request $request)
    {
        $count = $request->get('count');
        $before = $request->get('before');
        $after = $request->get('after');
        $blockIds = $request->get('blockIds');
        for ($i=0; $i < $count; $i++) {
            $block = InspectionImageBlock::find($blockIds[$i]);
            if ($block) {
                $block->problem_before = $before[$i];
                $block->problem_after = $after[$i];
                $block->save();
            } else {
                return [
                    'invalid' => true,
                ];
            }
        }

        return true;
    }

    /**
     * Create default inspection
     *
     * @param int $teamId
     * @param array $locations
     * @param int $countLocation
     *
     * @return inspectionId
     */
    private function createDefaultInspection($teamId, $locations, $countLocation) {
        $inspection = Inspection::create(
            [
                'team_id' => $teamId,
                'inspection_date' => date_create()->format('Y-m-d H:i:s'),
                'avg_point' => "1.0|1.0|1.0|1.0|1.0",
            ]
        );
        $inspectionId = $inspection->id;

        // Default point value is 1
        $points = [
            's1' => 1,
            's2' => 1,
            's3' => 1,
            's4' => 1,
            's5' => 1,
        ];

        // Create default details for new evidence
        for ($i=0; $i < $countLocation; $i++) {
            foreach ($points as $key => $val) {
                InspectionDetail::create([
                    'inspection_id' => $inspectionId,
                    'location_id' => $locations[$i],
                    'point' => $key,
                    'point_value' => $val,
                ]);
            }
        }

        return $inspectionId;
    }
}
