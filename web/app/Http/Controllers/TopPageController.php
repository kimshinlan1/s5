<?php

namespace App\Http\Controllers;

class TopPageController extends Controller
{
    /* @var team_service */

    public function __construct()
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('toppage.index');
    }
}
