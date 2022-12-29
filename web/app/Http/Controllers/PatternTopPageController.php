<?php

namespace App\Http\Controllers;

use App\Services\PatternService;
use Illuminate\Http\Request;

class PatternTopPageController extends Controller
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
        return view('pattern.pattern_top_page');
    }
}
