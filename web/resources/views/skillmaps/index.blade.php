@extends('layouts.app')

@push('css')
    <link href="{{ mix('/css/skillmap.css') }}" rel="stylesheet"/>
@endpush

@push('scripts_lib')

    {{-- <script src="{!! url('assets/jquery/jquery-3.2.1.slim.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/popper.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/bootstrap/js/bootstrap.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-1.6.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-ui.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery.ui.datepicker-ja.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/chart.min.js') !!}" type="text/javascript"></script> --}}

    <script src="{!! url('assets/bootstrap-4.0.0-dist/js/bootstrap.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-ui.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery.ui.datepicker-ja.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/chart.min.js') !!}" type="text/javascript"></script>

@endpush

@push('scripts')
    <script type="text/javascript">
        var employees = {{ Js::from($employee ?? []) }};
    </script>

    <script src="{{ mix('/js/skillmap.js') }}"></script>
    <script src="{{ mix('/js/pdf.js') }}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
    <div class="d-flex justify-content-between">
        <div class="h-title">
            <span style="margin-right: 0.5rem">{{ __('SkillMap') }}</span>
            @if(auth()->user()->isModeFree())
                <button class="btn btn-warning"
                style="opacity: 1; min-width: unset; border-radius: 0.25rem!important;" disabled>
                    {{ __('Common_Free_Badge') }}
                </button>
            @endif
            @if(!auth()->user()->isModeFree())
                <button class="btn btn-success"
                style="opacity: 1; min-width: unset; border-radius: 0.25rem!important;" disabled>
                    {{ __('Common_Paid_Badge') }}
                </button>
            @endif
        </div>
    </div>
    <div class="row" onclick="hideSkillUpLevel()">
        <div class="col-12">
            {{-- Option --}}
            <div style="display: flex">
                <div class="col-9">
                    <div class="input-group">
                        <div class="col-3">
                            <span class="input-group-text">{{ __('SkillMap_label_1') }}</span>
                        </div>
                        <div class="col-4">
                            <select class="form-select form-select-arrow" aria-label="Department select" id="department">
                            </select>
                        </div>
                        <div class="col-2">
                            <span class="input-group-text">{{ __('Common_Created_Date') }}</span>
                        </div>
                        <div class="col-2 date">
                            <input type="text" class="form-control" id="dateFrom" placeholder="yyyy年MM月dd日"
                                data-date-format="YYYY-MM-DD" readonly onclick="openCalendar('dateFrom')" data-toggle="tooltip"
                                title="{{ __('Common_Click_To_Select_Date') }}">
                        </div>
                    </div>
                    <div class="input-group">
                        <div class="col-3">
                            <span class="input-group-text">{{ __('SkillMap_label_3') }}</span>
                        </div>
                        <div class="col-4">
                            <input type="text" class="form-control" id="lineName" placeholder="[A-Za-z]">
                        </div>
                        <div class="col-2">
                            <span class="input-group-text">{{ __('Common_Last_Update_Date') }}</span>
                        </div>
                        <div class="col-2 date">
                            <input type="text" class="form-control" id="dateTo" placeholder="yyyy年MM月dd日"
                                data-date-format="YYYY-MM-DD" readonly onclick="openCalendar('dateTo')" data-toggle="tooltip"
                                title="{{ __('Common_Click_To_Select_Date') }}">
                        </div>
                    </div>
                </div>
                <div class="col-3">
                    <div style="display: flex-direction; margin-top: 9px;">
                        <div style="font-size: 0.7em; margin-bottom: 5px">
                            ● {{ __('SkillMap_label_5') }}
                        </div>
                        <div style="font-size: 0.7em; margin-bottom: 5px">
                            ◎{{ __('SkillMap_label_6') }}
                        </div>
                        <div style="font-size: 0.7em; margin-bottom: 5px">
                            ○ {{ __('SkillMap_label_7') }}
                        </div>
                        <div style="font-size: 0.7em">
                            △{{ __('SkillMap_label_8') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="main-container">

                {{-- Function --}}
                <div class="row header-table">
                    <div class="col-9 addition-note">
                        <div class="addition-note-1">
                            <div class="row">
                                <div class="col note">
                                    <span class="note-1">
                                        <div class="bg-note"></div>
                                        <span>{{ __('SkillMap_Up_Note_1') }}</span>
                                    </span>
                                    <span class="note-2">
                                        <div class="bg-note"></div>
                                        <span>{{ __('SkillMap_Up_Note_2') }}</span>
                                    </span>
                                    <span class="note-2">
                                        <span>{{ __('SkillMap_Up_Note_3') }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="position:absolute; margin-top:35px;font-size: 19px;">
                            <span >
                                <span>{{ __('Message_Note_SkillMap') }}</span>
                            </span>
                        </div>
                    </div>
                    <div class="col-3 action-content-btn">
                        <div class="col-3 action-btn">
                            <div class="form-check" style="padding: 10px;">
                                <input class="form-check-input" type="radio" name="flexRadioDefault"
                                    id="flexRadioDefault1" value="A3" checked>
                                <label class="form-check-label" for="flexRadioDefault1">
                                    A3
                                </label>
                            </div>
                            <div class="form-check" style="padding-left: 20px;">
                                <input class="form-check-input" type="radio" name="flexRadioDefault"
                                    id="flexRadioDefault2" value="A4">
                                <label class="form-check-label" for="flexRadioDefault2">
                                    A4
                                </label>
                            </div>
                            @if (!(auth()->user()->isModeFree()))
                            <div class="form-check" style="padding: 10px; padding-left: 100px;"  id="chartRadioDefault">
                                <input class="form-check-input-chart" type="radio" name="chartRadioDefault"
                                    id="chartRadioDefault1" value="A3">
                                <label class="form-check-label-chart" for="chartRadioDefault1">
                                    A3
                                </label>
                            </div>
                            <div class="form-check" style="padding-right: 156px;"  id="chartRadioDefault3">
                                <input class="form-check-input-chart" type="radio" name="chartRadioDefault"
                                    id="chartRadioDefault2" value="A4" checked>
                                <label class="form-check-label-chart" for="chartRadioDefault2">
                                    A4
                                </label>
                            </div>
                            @endif
                        </div>
                        <div class="col-3 action-btn" style="width: 528px">
                            <button type="button" id="save" class="btn btn-success btn-ripple" disabled>
                                <div class="inside-btn">
                                    {{ __('Skillmap_Button_Save') }}
                                </div>
                            </button>
                            <button type="button" id="pdf" class="btn btn-primary btn-ripple btn-pdf" disabled>
                                {{ __('Skillmap_Button_PDF') }}
                            </button>
                            @if (!(auth()->user()->isModeFree()))
                            <button type="button" id="pdfChart" class="btn btn-copy btn-chart" disabled>
                                {{ __('Skillmap_Button_PDF_Chart') }}
                            </button>
                            @endif
                        </div>
                    </div>
                </div>

                {{-- Data List --}}
                <div id="scroll-table" class="data_table">
                    <div class="main-table-group">
                        <div class="table-responsive" style="overflow-x: hidden; min-width: 450px;">
                            <table class="table table-bordered margin-top-0 table-left" id="table-left">
                                <thead>
                                    <tr id="header-1-table-left">
                                        <th scope="col" colspan="5">{{ __('SkillMap_Header_Item') }}</th>
                                    </tr>
                                    <tr style="height: 63.5px;" id="header-2-table-left">
                                        <th scope="col" style="width: 90px;z-index: 1;">{{ __('SkillMap_Header_CategoryName') }}</th>
                                        <th scope="col">{{ __('SkillMap_Header_No') }}</th>
                                        <th scope="col">{{ __('SkillMap_Header_SkillName') }}</th>
                                        <th scope="col" style="width: 51px">{{ __('SkillMap_Header_DifficultLevel') }}</th>
                                        <th scope="col">{{ __('SkillMap_Header_ExperiencedMonth') }}</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>

                        <div class="sticky-header-table-center">
                            <table class="table table-bordered margin-top-0 table-center">
                                <thead>
                                    <tr id="header-1-table-center">
                                        <th scope="col" colspan="5" id="title-table-center">{{ __('SkillMap_Header_EmployeeName') }}</th>
                                    </tr>
                                </thead>
                            </table>
                            <div class="table-responsive max-width-table margin-top-25-reverse" id="div-table-center">
                                <table class="table table-bordered margin-top-0 table-center" id="table-center">
                                    <thead>
                                        <tr style="height: 63.5px;" id="header-table-center">
                                            <th>{{ __('SkillMap_Table_EmployeeName') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>

                        <div class="table-responsive" style="overflow-x: hidden;">
                            <table class="table table-bordered margin-top-0 table-right" style="width: 200px;"
                                id="table-right">
                                <thead>
                                    <tr id="header-1-table-right">
                                        <th scope="col" colspan="3">{{ __('SkillMap_Header_TotalScore') }}</th>
                                    </tr>
                                    <tr style="height: 63.5px;" id="header-2-table-right">
                                        <th style='min-width: 55px;' scope="col">{{ __('SkillMap_Header_RequiredNumber') }}</th>
                                        <th scope="col">{{ __('SkillMap_Header_TrainedNumber') }}</th>
                                        <th scope="col">{{ __('SkillMap_Header_Progress') }}</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="input-group action-btn" style="justify-content: flex-start">
                <button type="button" id="openModal" disabled onclick="btnOpenModal()"
                    class="btn btn-primary btn-ripple" data-toggle="modal"
                    data-target="#exampleModalCenter">{{ __('Skillmap_Add_Category') }}</button>
                <button type="button" id="delete" class="btn btn-danger btn-ripple" disabled data-toggle="modal"
                    data-target="#exampleModalConfirm">
                    {{ __('Common_button_delete') }}
                </button>
                <button type="button" id="cancel" class="btn btn-secondary" data-toggle="modal"
                        onclick="btnOpenModalBackPage()">
                    {{ __('Common_Back') }}
                </button>
            </div>
        </div>
    </div>
    <!-- My Toast -->
    <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast1">
        <div class="d-flex">
            <div class="toast-body">
                {{ __('SkillMapp_Save_Successfully') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast2">
        <div class="d-flex">
            <div class="toast-body" id="body-danger-1">
                {{ __('SkillMap_Danger_1') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast3">
        <div class="d-flex">
            <div class="toast-body" id="body-danger-1">
                {{ __('SkillMap_Danger_2') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast4">
        <div class="d-flex">
            <div class="toast-body" id="body-danger-1">
                {{ __('SkillMap_Danger_3') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast5">
        <div class="d-flex">
            <div class="toast-body" id="body-danger-1">
                {{ __('SkillMap_Danger_4') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast6">
        <div class="d-flex">
            <div class="toast-body" id="body-danger-1">
                {{ __('SkillMap_Danger_5') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast7">
        <div class="d-flex">
            <div class="toast-body" id="body-danger-1">
                {{ __('SkillMap_Danger_6') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast8">
        <div class="d-flex">
            <div class="toast-body" id="body-danger-1">
                {{ __('SkillMap_Danger_7') }}
            </div>
        </div>
    </div>
    <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive"
        aria-atomic="true" id="toast9">
        <div class="d-flex">
            <div class="toast-body" id="body-danger-1">
                {{ __('SkillMap_MaxLength') }}
            </div>
        </div>
    </div>

    <!-- Right click Menu -->
    <div class="shadow list-group right-click-menu" id="right-click-menu">
        <button type="button" class="list-group-item list-group-item-action btn-ripple active-while border-button"
            onclick="paintBgSkillMap(this, 'while')">{{ __('SkillUp_Button_0') }}</button>
        <button type="button" class="list-group-item list-group-item-action btn-ripple active-pink border-button"
            onclick="paintBgSkillMap(this, 'pink')">{{ __('SkillUp_Button_1') }}</button>
        <button type="button" class="list-group-item list-group-item-action btn-ripple active-yellow border-button"
            onclick="paintBgSkillMap(this, 'yellow')">{{ __('SkillUp_Button_2') }}</button>
    </div>

    <!-- Modal -->
    <div class="modal " id="exampleModalCenter" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">作業名の行数を含む新しい分類を追加する。</h5>
                </div>
                <div class="modal-body" id="modal-body">
                    <form id="myForm">
                        <div class="input-group">
                            <div class="col">
                                <input type="text" class="form-control" placeholder="分類名" autofocus
                                    id="category" required="required" />
                            </div>
                            <div class="col">
                                <input type="text" class="form-control" maxlength="3" placeholder="作業名の行数"
                                    id="rowTable" required="required" />
                            </div>
                        </div>
                        <button type="submit" name="submit" style="display: none;" />
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal"
                        id="btnModalCategoryCancel">{{ __('Common_button_cancel') }}</button>
                    <button type="button" onclick="validateMyFormSkillMap()" id="btnModalCategoryAdd"
                        class="btn btn-primary">{{ __('SkillMap_Add_Line') }}</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Confirm -->
    <div class="modal fade" id="exampleModalConfirm" tabindex="-1" role="dialog"
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
    </div>
    <!-- Modal confirm save data when back page -->
    <div class="modal fade" id="backPageModalConfirm" tabindex="-1" role="dialog"
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
    </div>
    <!-- Modal confirm save data and export pdf -->
    <div class="modal fade" id="saveExportPdf" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">{{ __('Common_Confirm') }}</h5>
                </div>
                <div class="modal-body" id="modal-body">
                    <h4><span>{{ __('Skillmap_PDF_Confirm') }}</span></h4>
                </div>
                <div class="modal-footer">
                    <button type="button" onclick="saveAndExport()"
                        class="btn btn-primary">{{ __('Common_button_ok') }}</button>
                    <button type="button" class="btn btn-secondary" onclick="cancelExport()">
                        {{ __('Common_button_cancel') }}</button>

                </div>
            </div>
        </div>
    </div>
    <!-- Modal confirm save data -->
    <div class="modal fade" id="saveData" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">{{ __('Common_Confirm') }}</h5>
                </div>
                <div class="modal-body" id="modal-body">
                    <h4><span>{{ __('Skillmap_Button_Save_Confirm') }}</span></h4>
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
@endsection
