<?php

namespace App\Http\Controllers;

class TopPageController extends Controller
{
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
