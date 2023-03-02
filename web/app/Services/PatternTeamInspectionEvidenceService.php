<?php

namespace App\Services;

use App\Common\Constant;
use App\Models\Inspection;
use Illuminate\Http\Request;
use App\Models\InspectionImage;
use App\Models\InspectionDetail;
use App\Models\InspectionImageBlock;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManagerStatic as Image;

class PatternTeamInspectionEvidenceService extends BaseService
{
    /* @var Model */
    private $imageModel;
    private $imageBlockModel;

    public function __construct(InspectionImage $imageModel, InspectionImageBlock $imageBlockModel)
    {
        // todo: update
        $this->imageModel = $imageModel;
        $this->imageBlockModel = $imageBlockModel;
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
        ->distinct()->orderBy('id')->get();

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
            $img = $img->delete();
        }
        return $img;
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

        $arr = [
            'inspection_id' => $inspectionID
        ];
        $data = $this->imageBlockModel::create($arr);
        if ($data) {
            $imgPath = $this->inspectionImagePath(null, $inspectionID, $data->id);
            if (!File::exists($imgPath)) {
                File::makeDirectory($imgPath, 0777, true, true);
            }
        } else {
            return [
                'invalid' => true,
            ];
        }

        return $data;
    }

     /**
     * Remove a block
     *
     * @param int $id
     * @param  \Illuminate\Http\Request  $request
     *
     * @return object
     */
    public function removeExistingBlock($id, Request $request)
    {
        $data = $this->imageBlockModel->find($id);
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
            $sourcePath = Constant::INSPECTION_IMAGE_PATH . '/inspection' . $inspectionId . '/block' . $id;
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
            $sourcePath = $this->inspectionImagePath($isBefore, $inspectionId, $blockID);
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
        $inspecionId = $request->get('inspecionId');
        $before = explode(',', $request->get('before'));
        $after = explode(',', $request->get('after'));
        $blockIds = explode(',', $request->get('blockIds'));
        for ($i=0; $i < $count; $i++) {
            $block = InspectionImageBlock::findOrFail($blockIds[$i]);
            if ($block) {
                $block->update([
                    'problem_before' => "$before[$i]",
                    'problem_after' => $after[$i],
                ]);
                $block->save();
            } else {
                return [
                    'invalid' => true,
                ];
            }
            $countBeforeImg = $request->get('countBeforeImg_block' . $block->id);
            $countAfterImg = $request->get('countAfterImg_block' . $block->id);
            if ($countBeforeImg > 0) {
                for ($j=0; $j < $countBeforeImg; $j++) {
                    $image = $request->file('file_before_block' . $block->id . '_' . $j);
                    if (!empty($image)) {
                        $this->createImage(true, $inspecionId, $block->id, $image);
                    } else {
                        return [
                            'invalid' => true,
                        ];
                    }
                }
            }

            if ($countAfterImg > 0) {
                for ($j=0; $j < $countAfterImg; $j++) {
                    $image = $request->file('file_after_block' . $block->id . '_' . $j);
                    if (!empty($image)) {
                        $this->createImage(false, $inspecionId, $block->id, $image);
                    } else {
                        return [
                            'invalid' => true,
                        ];
                    }
                }
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
    private function createDefaultInspection($teamId, $locations, $countLocation)
    {
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

    /**
     * Create default inspection
     *
     * @param boolean $isBefore
     * @param int $inspectionId
     * @param int $blockId
     *
     * @return string path
     */
    private function inspectionImagePath($isBefore, $inspectionId, $blockId)
    {
        if ($isBefore != null) {
            return $isBefore ?
            Constant::INSPECTION_IMAGE_PATH . '/inspection' . $inspectionId . '/block' . $blockId . '/before/':
            Constant::INSPECTION_IMAGE_PATH . '/inspection' . $inspectionId . '/block' . $blockId . '/after/';
        } else {
            return Constant::INSPECTION_IMAGE_PATH . '/inspection' . $inspectionId . '/block' . $blockId;
        }
    }

    /**
     * Create default inspection
     *
     * @param boolean $isBefore
     * @param int $inspectionId
     * @param int $blockId
     *
     * @return string path
     */
    private function createImage($isBefore, $inspectionId, $blockId, $image)
    {
        $imgPath = $this->inspectionImagePath($isBefore, $inspectionId, $blockId);

        if (!File::exists($imgPath)) {
            File::makeDirectory($imgPath, 0777, true, true);
        }
        $fileName = $image->getClientOriginalName();
        $isExistedName = $this->imageModel->where('img_name', $fileName)->exists();
        if ($isExistedName) {
            $fileName = date_create()->format('Y-m-d-H:i:s') . '-' . $fileName;
        }
        $location = $imgPath . $fileName;
        Image::make($image)->save($location);

        $data = [
            'block_id' => $blockId,
            'inspection_id' => $inspectionId,
            'img_name' => $fileName,
            'img_path' => $imgPath .$fileName,
            'is_before' => $isBefore,
        ];

        $res = $this->imageModel::create($data);
        $res = $res->save();

        // return $res
    }
}
