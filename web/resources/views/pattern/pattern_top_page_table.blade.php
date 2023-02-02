<?php
    $width_data = "50px";
?>
<div style="width: 100%; height: auto; overflow-x: auto; ">
    <table id="topPageTable" class="table table-bordered">

        @foreach ($inspectionData as $inspection)

        {{-- Dept Name --}}
        <tr>
            <td colspan="{{ $countInspection }}">
                <strong>DEPT: {{ $inspection['dept_name'] }}</strong>
            </td>

            {{-- Hidden --}}
            <input type="hidden" id="hidDeptId_{{ $inspection['dept_id'] }}" value="{{ $inspection['dept_id'] }}" data-avgPoint="{{ $inspection['dept_avgPoint'] }}"/>
        </tr>

        {{-- Radar Chart --}}
        <tr style="">
            @for ($i = 0; $i < $countInspection; $i++)
            <td style="width: {{ $width_data }}">
                Radar chart
                <canvas class="radarChart" id="radarchart_dept_{{ $inspection['dept_id'] }}"></canvas>
            </td>
            @endfor
        </tr>

        {{-- Bar Chart --}}
        <tr style="">
            <td colspan="{{ $countInspection }}">
                Bar chart
                <canvas style="width: 15px; height: 10px;" id="barchart_dept_{{ $inspection['dept_id'] }}"></canvas>
            </td>
        </tr>

        {{-- Check toggle team inspection chart --}}
        @if (count($inspection['teams']))
            <tr style="">
                <td colspan="{{ $countInspection }}" style="text-align: center">
                    <input style="" type="button" class="btn-danger rounded-3" id="btnTeamInspection" value="{{ __('TopPage_Expand_Button') }}" onclick="showHideTeam('{{ $inspection['dept_id'] }}')"/>
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

                    <input style="" type="button" class="btn-info rounded-3" id="btnInput" value="{{ __('TopPage_Evidence_Button') }}" onclick="gotoInspectionPage('{{ $team['team_id'] }}')"/>
                </td>

            </tr>

            {{-- Radar Chart --}}
            <tr id="dept_{{ $inspection['dept_id'] }}-team_{{ $team['team_id'] }}-radarchart" style="display: none">
                @for ($i = 0; $i < $countInspection; $i++)
                <td style="width: {{ $width_data }}">
                    Radar chart
                    <canvas class="radarChart" id="radarchart_team_{{ $team['team_id'] }}-{{ $i }}"></canvas>
                </td>
                @endfor
            </tr>

            {{-- Bar Chart --}}
            <tr id="dept_{{ $inspection['dept_id'] }}-team_{{ $team['team_id'] }}-barchart" style="display: none">
                <td colspan="{{ $countInspection }}">
                    Bar chart
                    <canvas style="width: 15px; height: 10px;" id="barchart_team_{{ $team['team_id'] }}"></canvas>
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
                    <input style="" type="button" class="btn-primary rounded-3" value="{{ __('TopPage_Redirect_Inspection_Button') }}" onclick="redirectToInspection({{ $team['team_id'] }})"/>
                    @else
                    <input style="" type="button" class="btn-secondary rounded-3" value="{{ __('TopPage_Redirect_Inspection_Button') }}" onclick=""/>
                    @endif
                </td>

                {{-- Hidden AVG Point (use for render chart) --}}
                <input type="hidden" id="hidAvgPoint_{{ $i }}" value="{{ $avgPoint }}"/>
                <input type="hidden" id="hidCountInspection" value="{{ $countInspection }}"/>

                @endfor
            </tr>


            @endforeach

        @endif




        @endforeach

    </table>
</div>