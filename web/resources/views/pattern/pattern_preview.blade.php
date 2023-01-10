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

    <script type="text/javascript">
        $(function () {
            loadDataPreview('{{ $pageDest }}');
        });
    </script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
    <style>
        table {
            border-color: black !important;
        }
    </style>

    <div class="h-title">{{ __('Pattern_Detail_5S_Checklist_Pattern_Preview') }}</div>
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
                                data-date-format="YYYY-MM-DD" readonly onclick="openCalendar('dateCreate')" data-toggle="tooltip"
                                title="{{ __('Common_Click_To_Select_Date') }}" value="">
                            <input type="hidden" id="hidDateCreate" value="{{ isset($info['created_at']) ? $info['created_at'] : '' }}"/>
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
                                data-date-format="YYYY-MM-DD" readonly onclick="openCalendar('dateUpdate')" data-toggle="tooltip"
                                title="{{ __('Common_Click_To_Select_Date') }}" value="">
                            <input type="hidden" id="hidDateUpdate" value="{{ isset($info['updated_at']) ? $info['updated_at'] : '' }}"/>
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
                                        <th class="value-area" scope="col">{{ __('Pattern_Detail_Area') }}</th>
                                        <th class="value-location" scope="col">{{ __('Pattern_Detail_Location') }}</th>
                                        <th class="value-5s" scope="col">{{ __('Pattern_Detail_Point') }}</th>
                                        <th class="value-level" scope="col">{{ __('Pattern_Detail_Level_1') }}</th>
                                        <th class="value-level" scope="col">{{ __('Pattern_Detail_Level_2') }}</th>
                                        <th class="value-level" scope="col">{{ __('Pattern_Detail_Level_3') }}</th>
                                        <th class="value-level" scope="col">{{ __('Pattern_Detail_Level_4') }}</th>
                                        <th class="value-level" scope="col">{{ __('Pattern_Detail_Level_5') }}</th>
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
            <br />
            <div class="action-btn" style="justify-content: flex-start">
                @if (!auth()->user()->is5SModeFree())
                <button type="button" id="btnEdit" class="btn btn-primary" >
                    {{ __('Common_Edit') }}
                </button>
                @endif
                <button type="button" id="btnBackPage" class="btn btn-secondary">
                    {{ __('Common_Back') }}
                </button>
            </div>  
        </div>
    </div>
    {{-- Hidden --}}
    <input type="hidden" id="hidPatternId" value="{{ isset($info['id']) ? $info['id'] : '' }}" />
    <input type="hidden" id="hidTypeBackPage" value="{{ $pageDest }}" />


@endsection
