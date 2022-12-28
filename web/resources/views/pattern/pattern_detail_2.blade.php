@extends('layouts.app')

@push('css')
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="Stylesheet"
        type="text/css"/>
    <link href="{{ mix('/css/pattern.css') }}" rel="stylesheet"/>
@endpush

@push('scripts')
    <script src="{!! url('assets/jquery/jquery-3.2.1.slim.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-1.6.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-ui.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery.ui.datepicker-ja.min.js') !!}" type="text/javascript"></script>
    <script src="{{ mix('/js/pattern_detail_2.js') }}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
    <div class="h-title">{{ __('Pattern_Detail_5S_Checklist_Pattern_Input') }}</div>
    <div class="row">
        <div class="col-12">
            {{-- Option --}}
            <div style="display: flex">
                <div class="col-9">
                    <div class="input-group" style="margin-bottom: 0.5%;">
                        <div class="label_header">
                            <span class="input-group-text">{{ __('Pattern_Detail_Name') }}</span>
                        </div>
                        <div class="label_header_1">
                            <input type="text" class="form-control" id="patternName" value="{{ isset($info['name']) ? $info['name'] : '' }}">
                        </div>
                        <div class="label_header">
                            <span class="input-group-text">{{ __('Common_Created_Date') }}</span>
                        </div>
                        <div class="date">
                            <input type="text" class="form-control" id="dateCreate" placeholder="yyyy年MM月dd日"
                                data-date-format="YYYY-MM-DD" onclick="openCalendar('dateCreate')" data-toggle="tooltip"
                                title="{{ __('Common_Click_To_Select_Date') }}">
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="label_header">
                            <span class="input-group-text">{{ __('Pattern_Detail_Explanation') }}</span>
                        </div>
                        <div class="label_header_1">
                            <input type="text" class="form-control" id="patternNote" value="{{ isset($info['note']) ? $info['note'] : '' }}">
                        </div>
                        <div class="label_header">
                            <span class="input-group-text">{{ __('Common_Last_Update_Date') }}</span>
                        </div>
                        <div class="date">
                            <input type="text" class="form-control" id="dateUpdate" placeholder="yyyy年MM月dd日"
                                data-date-format="YYYY-MM-DD" onclick="openCalendar('dateUpdate')" data-toggle="tooltip"
                                title="{{ __('Common_Click_To_Select_Date') }}">
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <fieldset style="display: flex;" class="check_5s">
                <legend class="legend_5s"><strong>{{ __('Pattern_Detail_Selection_Of_Improvement_Points') }}</strong></legend>
                <div class="checkbox">
                    <input type="checkbox" id="s1" name="s1" value="s1" onchange="select5S(this)" checked>
                    <label class="label_5s" for="s1">{{ __('Pattern_Detail_S1') }}</label>
                </div>
                <div class="checkbox">
                    <input type="checkbox" id="s2" name="s2" value="s2" onchange="select5S(this)" checked>
                    <label class="label_5s" for="s2">{{ __('Pattern_Detail_S2') }}</label>
                </div>
                <div class="checkbox">
                    <input type="checkbox" id="s3" name="s3" value="s3" onchange="select5S(this)" checked>
                    <label class="label_5s" for="s3">{{ __('Pattern_Detail_S3') }}</label>
                </div>
                <div class="checkbox">
                    <input type="checkbox" id="s4" name="s4" value="s4" onchange="select5S(this)" checked>
                    <label class="label_5s" for="s4">{{ __('Pattern_Detail_S4') }}</label>
                </div>
                <div class="checkbox">
                    <input type="checkbox" id="s5" name="s5" value="s5" onchange="select5S(this)" checked>
                    <label class="label_5s" for="s5">{{ __('Pattern_Detail_S5') }}</label>
                </div>
            </fieldset>
            <div class="main-container">
                {{-- Data List --}}
                <div id="scroll-table" class="data_table">
                    <div class="main-table-group">
                        <div class="table-scroll">
                            <table class="table table-bordered" id="table-content" style="width: 100%">
                                <thead class="table_header">
                                    <tr style="height: 40.5px;" id="header-2-table-content">
                                        <th scope="col">{{ __('Pattern_Detail_Area') }}</th>
                                        <th scope="col">{{ __('Pattern_Detail_Location') }}</th>
                                        <th style="width: 6%;" scope="col">{{ __('Pattern_Detail_Point') }}</th>
                                        <th style="width: 15%;" scope="col">{{ __('Pattern_Detail_Level_1') }}</th>
                                        <th style="width: 15%;" scope="col">{{ __('Pattern_Detail_Level_2') }}</th>
                                        <th style="width: 15%;" scope="col">{{ __('Pattern_Detail_Level_3') }}</th>
                                        <th style="width: 15%;" scope="col">{{ __('Pattern_Detail_Level_4') }}</th>
                                        <th style="width: 15%;" scope="col">{{ __('Pattern_Detail_Level_5') }}</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>

                            {{-- Hidden --}}

                        </div>
                    </div>
                </div>
            </div>
            <br>
            Total Rows:<strong id="countRows"></strong>
            <br>
            <button onclick="setValueTest()">Set value test</button>
            <br>
            <div class="action-btn" style="justify-content: flex-start">
                <button type="button" id="save" class="btn btn-success btn-ripple" style="margin-right: 1%;">
                    <div class="inside-btn">
                        {{ __('Common_button_save') }}
                    </div>
                </button>

                <button type="button" id="openModal" class="btn btn-primary btn-ripple" data-toggle="modal"
                    style="margin-right: 1%;">{{ __('Pattern_Add_Inspection_Point') }}
                </button>

                <button type="button" id="removeLocation"
                    class="btn btn-danger btn-ripple" data-toggle="modal" style="margin-right: 1%;"
                    data-target="#exampleModalConfirm">{{ __('Common_button_delete') }}
                </button>

                {{-- <button type="button" id="removeLocation"
                    class="btn btn-secondary">{{ __('Common_button_cancel') }}</button> --}}
            </div>
        </div>
    </div>
    <!-- My Toast -->
    <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="patternSaveSuccess">
        <div class="d-flex">
            <div class="toast-body">
                {{ __('Pattern_Save_Successfully') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="patternNameErr">
        <div class="d-flex">
            <div class="toast-body" id="body-danger-1">
                {{ __('Pattern_Adding_A_Pattern_Name_Is_Mandatory') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="areaNameErr">
        <div class="d-flex">
            <div class="toast-body" id="body-danger-1">
                {{ __('Pattern_Adding_An_Area_Name_Is_Mandatory') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="locationNameErr">
        <div class="d-flex">
            <div class="toast-body" id="body-danger-1">
                {{ __('Pattern_Adding_The_Location_Name_Is_Mandatory') }}
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modalAddInspectionPoint" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ __('Pattern_Adds_Inspection_Points_With_Location_Number_In_The_Area') }}</h5>
                </div>
                <div class="modal-body" id="modal-body">
                    <form id="myForm">
                        <div class="input-group">
                            <div class="col" style="margin-right: 2%">
                                <input type="text" class="form-control" placeholder="{{ __('Pattern_Area_Name') }}" autofocus
                                    id="area" required="required"/>
                            </div>
                            <div class="col">
                                <input type="text" class="form-control" maxlength="3" placeholder="{{ __('Pattern_Location_Number_In_The_Area') }}"
                                    id="locationNo" required="required"/>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" onclick="cancelAddAreaToTable()"
                    class="btn btn-secondary">{{ __('Common_button_cancel') }}</button>
                    <button type="button" onclick="addAreaToTable()"
                        class="btn btn-primary">{{ __('Pattern_Add_Inspection_Point') }}</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Confirm -->
    {{-- <div class="modal fade" id="exampleModalConfirm" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">確認</h5>
                </div>
                <div class="modal-body" id="modal-body">
                    <h4><span class="badge bg-danger">{{ __('SkillMap_Question_Delete_1') }}</span></h4>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal"
                        id="btnCancelConfirm">{{ __('Common_button_cancel') }}</button>
                    <button type="button" onclick="deleteDataSkillMap()"
                        class="btn btn-primary">{{ __('Common_button_ok') }}</button>
                </div>
            </div>
        </div>
    </div> --}}
    <!-- Modal confirm save data when back page -->
    {{-- <div class="modal fade" id="backPageModalConfirm" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">{{ __('Common_Confirm') }}</h5>
                </div>
                <div class="modal-body" id="modal-body">
                    <h4><span>{{ __('SkillMap_Question_BackPage') }}</span></h4>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="backPageSaveData(false)">
                        {{ __('SkillMap_Cancel_Save_Button') }}</button>
                    <button type="button" onclick="backPageSaveData(true)"
                        class="btn btn-primary">{{ __('Common_button_save') }}</button>
                </div>
            </div>
        </div>
    </div> --}}
    <!-- Modal confirm save data -->
    <div class="modal fade" id="saveData" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">{{ __('Common_Confirm') }}</h5>
                </div>
                <div class="modal-body" id="modal-body">
                    <h4><span>{{ __('Pattern_Label_Modal_Save_Pattern') }}</span></h4>
                </div>
                <div class="modal-footer">
                    <button type="button" onclick="saveDataChange()"
                        class="btn btn-primary">{{ __('Common_button_ok') }}</button>
                    <button type="button" class="btn btn-secondary" onclick="cancelSaveDataChange()">
                        {{ __('Common_button_cancel') }}</button>

                </div>
            </div>
        </div>
    </div>

@include('layouts.confirm')

    {{-- Hidden --}}
    <input type="hidden" id="hidPatternId" value="{{ isset($info['id']) ? $info['id'] : '' }}" />

@endsection
