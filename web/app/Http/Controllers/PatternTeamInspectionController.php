<?php

namespace App\Http\Controllers;

use App\Common\Constant;
use Illuminate\Http\Request;

class PatternTeamInspectionController extends Controller
{
    // /* @var team_service */
    // private $service;

    // public function __construct(TeamService $service)
    // {
    //     $this->service = $service;
    // }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('pattern.pattern_team_inspection');
    }
}
