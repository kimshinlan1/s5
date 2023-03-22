<?php

namespace App\Services;

use App\Common\Constant;
use App\Common\LogUtil;
use App\Models\Area;
use App\Models\Inspection;
use App\Models\InspectionDetail;
use App\Models\InspectionImage;
use App\Models\InspectionImageBlock;
use App\Models\Location;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\File;

class BaseService
{
    /** @var Model */
    private $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * index
     *
     * @return array
     */
    public function getAll()
    {
        return $this->model::orderBy('id')->get();
    }

    /**
     * Get list by conditions
     *
     * @param  \Illuminate\Http\Request  $request
     * @return object
     */
    public function getList(Request $request)
    {
        $limit = $request->input('limit');
        return $this->model::orderBy('id')->paginate($limit);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return object
     */
    public function destroy($id)
    {
        $data = $this->model::find($id);
        $data->delete();
        return $data;
    }

    /**
     * Get array of location ids by department Id
     *
     * @param  int  $deptPatternId
     * @return array
     */
    public function getLocationsByDeptPattern($deptPatternId)
    {
        $areaIds = Area::where('dept_pattern_id', $deptPatternId)->distinct()->pluck('id')->toArray();
        $locationIds = Location::whereIn('area_id', $areaIds)->distinct()->pluck('id')->toArray();
        return $locationIds;
    }

     /**
     * Remove the inspection data and evidence data by dept id
     * @param  int  $deptId
     * @return object
     */
    public function removeRedundantDataByDeptId($deptId)
    {
        try {
            $teamIds = Team::where("department_id", $deptId)->pluck('id')->toArray();
            $inspectionIds = Inspection::whereIn("team_id", $teamIds)->pluck('id')->toArray();
            $blockIds = InspectionImageBlock::whereIn("inspection_id", $inspectionIds)->pluck('id')->toArray();
            $images = InspectionImage::whereIn("block_id", $blockIds)->pluck('id')->toArray();

            // Remove redundant data
            InspectionImage::whereIn("id", $images)->delete();
            InspectionImageBlock::whereIn("id", $blockIds)->delete();
            InspectionDetail::whereIn("inspection_id", $inspectionIds)->delete();
            Inspection::whereIn("id", $inspectionIds)->delete();

            // Remove redundant directories
            foreach ($inspectionIds as $inspectionId) {
                $path = Constant::INSPECTION_IMAGE_PATH . '/inspection' . $inspectionId;
                if (File::exists($path)) {
                    File::deleteDirectory($path);
                }
            }
        } catch (QueryException $e) {
            LogUtil::setClassName(__TRAIT__);
            LogUtil::logError(__FUNCTION__, $e->getMessage());
            return false;
        } catch (\Exception $e) {
            LogUtil::setClassName(__CLASS__);
            LogUtil::logError(__FUNCTION__, $e->getMessage());
            return false;
        }
        return true;
    }
}
