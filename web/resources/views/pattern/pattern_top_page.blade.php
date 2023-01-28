@extends('layouts.app')

@push('css')
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="Stylesheet"
        type="text/css"/>
    {{-- <link href="{{ mix('/css/pattern.css') }}" rel="stylesheet"/> --}}
@endpush

@push('scripts')
    <script src="{!! url('assets/jquery/jquery-3.2.1.slim.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-1.6.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-ui.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery.ui.datepicker-ja.min.js') !!}" type="text/javascript"></script>
    <script src="{{ mix('/js/pattern_top_page.js') }}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')
    <div class="h-title">5Sトップページ</div>

    <?php
        $width_data = "50px";
    ?>

    <div style="width: 100%; height: auto; overflow: auto; ">
        <table id="" class="table table-bordered">

            @foreach ($inspectionData as $inspection)

            {{-- Dept Name --}}
            <tr>
                <td colspan="{{ $countInspection }}">
                    <strong>DEPT: {{ $inspection['dept_name'] }}</strong>
                </td>

                {{-- Hidden --}}
                <input type="hidden" id="hidDeptId_{{ $inspection['dept_id'] }}" value="{{ $inspection['dept_id'] }}"/>
            </tr>

            {{-- Radar Chart --}}
            <tr style="">
                @for ($i = 0; $i < $countInspection; $i++)
                <td style="width: {{ $width_data }}">
                    Radar chart
                    <canvas id="radarchart_dept_{{ $inspection['dept_id'] }}-{{ $i }}"></canvas>
                </td>
                @endfor
            </tr>

            {{-- Bar Chart --}}
            <tr style="">
                <td colspan="{{ $countInspection }}">
                    Bar chart
                    <canvas style="width: 15px; height: 10px;" id="barchart_dept_{{ $inspection['dept_id'] }}-{{ $i }}"></canvas>
                </td>
            </tr>

            {{-- Check toggle team inspection chart --}}
            @if (count($inspection['teams']))
                <tr style="">
                    <td colspan="{{ $countInspection }}">
                        <input style="" type="button" class="btn-danger" id="btnTeamInspection" value="各係のグラフを見る" onclick="showHideTeam('{{ $inspection['dept_id'] }}')"/>
                    </td>
                </tr>

                @foreach ($inspection['teams'] as $team)

                @php
                    $inspections = $team['inspections'];
                @endphp

                {{-- Hidden --}}
                <input type="hidden" id="hid_deptId_{{ $inspection['dept_id'] }}_teamId_{{ $team['team_id'] }}" value="{{ $team['team_id'] }}"/>

                {{-- Team Name --}}
                <tr id="dept_{{ $inspection['dept_id'] }}-team_{{ $team['team_id'] }}" style="display: none">
                    <td colspan="{{ $countInspection }}">
                        <strong style="">TEAM: {{ $team['team_name'] }}</strong>

                        <input style="" type="button" class="btn-info" id="btnInput" value="入力画面へ進む" onclick="gotoInspectionPage('{{ $team['team_id'] }}')"/>
                    </td>

                </tr>

                {{-- Radar Chart --}}
                <tr id="dept_{{ $inspection['dept_id'] }}-team_{{ $team['team_id'] }}-radarchart" style="display: none">
                    @for ($i = 0; $i < $countInspection; $i++)
                    <td style="width: {{ $width_data }}">
                        Radar chart
                        <canvas id="radarchart_team-{{ $i }}"></canvas>
                    </td>
                    @endfor
                </tr>

                {{-- Bar Chart --}}
                <tr id="dept_{{ $inspection['dept_id'] }}-team_{{ $team['team_id'] }}-barchart" style="display: none">
                    <td colspan="{{ $countInspection }}">
                        Bar chart
                        <canvas style="width: 15px; height: 10px;" id="barchart_team-{{ $i }}"></canvas>
                    </td>
                </tr>

                {{-- 改善結果を見る --}}
                <tr id="dept_{{ $inspection['dept_id'] }}-team_{{ $team['team_id'] }}-info" style="display: none">
                    @for ($i = 0; $i < $countInspection; $i++)

                    @php
                        $countImgs = isset($inspections[$i]['count_evidence'])
                        ? $inspections[$i]['count_evidence'] : 0;

                        $avgPoint = isset($inspections[$i]['avg_point']) ? $inspections[$i]['avg_point'] : '';
                    @endphp

                    <td>
                        @if ($countImgs)
                        <input style="" type="button" class="btn-primary" value="改善結果を見る" onclick=""/>
                        @else
                        <input style="" type="button" class="btn-secondary" value="改善結果を見る" onclick=""/>
                        @endif
                    </td>

                    {{-- Hidden AVG Point (use for render chart) --}}
                    <input type="hidden" id="hidAvgPoint_{{ $i }}" value="{{ $avgPoint }}"/>

                    @endfor
                </tr>


                @endforeach

            @endif




            @endforeach

        </table>
    </div>




@endsection
