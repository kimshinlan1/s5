<?php
$width_data = '250px';
?>
<div style="" id="scrolling">
    <div style="width: 100%; height: auto;">
        @foreach ($inspectionData as $inspection)
            <table id="topPageTable" class="table table-bordered">
                {{-- Dept Name --}}
                <tr>
                    <td colspan="{{ $countInspection }}">
                        <strong>DEPT: {{ $inspection['dept_name'] }}</strong>
                    </td>

                    {{-- Hidden --}}
                    <input type="hidden" id="hidDeptId_{{ $inspection['dept_id'] }}" value="{{ $inspection['dept_id'] }}"
                        data-avgPoint="{{ $inspection['dept_avgPoint'] }}" />
                </tr>

                {{-- Radar Chart --}}
                <tr id="deptRadarChart">
                    @for ($i = 0; $i < $countInspection; $i++)
                        <td style="width: {{ $width_data }}">
                            <canvas class="radarChart"
                                id="radarchart_dept_{{ $inspection['dept_id'] }}-{{ $i }}"></canvas>
                        </td>
                    @endfor
                </tr>

                {{-- Bar Chart --}}
                <tr>
                    <td colspan="{{ $countInspection }}">
                        <canvas class="barChart" style="width: 15px; height: 10px;" id="barchart_dept_{{ $inspection['dept_id'] }}"></canvas>
                    </td>
                </tr>
            </table>

            <fieldset class="form-group border border-collapse" id="fiestSetId">
                @if (count($inspection['teams']))
                    <legend class="float-none w-auto">
                        <button style="" class="btn-danger rounded-3 btnTeamInspection" id="btnTeamInspection"
                            value="{{ __('TopPage_Expand_Button') }}"
                            onclick="showHideTeam('{{ $inspection['dept_id'] }}')">
                            <i class="fa fa-plus" aria-hidden="true"></i> {{ __('TopPage_Expand_Button') }}
                        </button>
                    </legend>
                    <table>
                        {{-- Check toggle team inspection chart --}}
                        @foreach ($inspection['teams'] as $team)
                            @php
                                $inspections = $team['inspections'];
                            @endphp

                            {{-- Hidden --}}
                            <input type="hidden"
                                id="hid_deptId_{{ $inspection['dept_id'] }}_teamId_{{ $team['team_id'] }}-0"
                                value="{{ $team['team_id'] }}" />

                            {{-- Team Name --}}
                            <tr class="rows team-name-row"
                                id="dept_{{ $inspection['dept_id'] }}-team_{{ $team['team_id'] }}"
                                style="display:none">
                                <td colspan="{{ $countInspection }}" style="padding-left: 1rem; font-size: 18px;">
                                    <strong style="">TEAM: {{ $team['team_name'] }}</strong>
                                    <input style="" type="button" class="btn-info rounded-3" id="btnInput"
                                        value="{{ __('TopPage_Evidence_Button') }}"
                                        onclick="gotoInspectionPage('{{ $team['team_id'] }}')" />
                                </td>
                            </tr>

                            {{-- Radar Chart --}}
                            <tr class="rows radarChartRow teamRadarChart"
                                id="dept_{{ $inspection['dept_id'] }}-team_{{ $team['team_id'] }}-radarchart"
                                style="display: none">
                                @for ($i = 0; $i < $countInspection; $i++)
                                    <td style="width: {{ $width_data }}">
                                        <canvas class="radarChart"
                                            id="radarchart_team_{{ $team['team_id'] }}-{{ $i }}"></canvas>
                                    </td>
                                @endfor
                            </tr>

                            {{-- Bar Chart --}}
                            <tr class="rows"
                                id="dept_{{ $inspection['dept_id'] }}-team_{{ $team['team_id'] }}-barchart"
                                style="display: none; border-bottom-color: transparent;">
                                <td colspan="{{ $countInspection }}">
                                    <canvas class="barChart" style="width: 15px; height: 10px;" id="barchart_team_{{ $team['team_id'] }}"></canvas>
                                </td>
                            </tr>

                            {{-- 改善結果を見る --}}
                            <tr id="dept_{{ $inspection['dept_id'] }}-team_{{ $team['team_id'] }}-info"
                                style="display: none; height: 3rem;" class="rows btn-row">
                                @for ($i = 0; $i < $countInspection; $i++)
                                    @php
                                        $countImgs = isset($inspections[$i]['count_evidence']) ? $inspections[$i]['count_evidence'] : 0;
                                        $avgPoint = isset($inspections[$i]['avg_point']) ? $inspections[$i]['avg_point'] : '';
                                    @endphp

                                    <td style="text-align: center;">
                                        @if ($countImgs)
                                            <input style="" type="button" class="btn-primary rounded-3"
                                                value="{{ __('TopPage_Redirect_Inspection_Button') }}"
                                                onclick="redirectToInspection({{ $team['team_id'] }})" />
                                        @else
                                            <input style="" type="button" class="btn-secondary rounded-3"
                                                value="{{ __('TopPage_Redirect_Inspection_Button') }}"
                                                onclick="" />
                                        @endif
                                    </td>

                                    {{-- Hidden AVG Point (use for render chart) --}}
                                    <input type="hidden" id="hidAvgPoint_{{ $i }}"
                                        value="{{ $avgPoint }}" />
                                    <input type="hidden" id="hidCountInspection" value="{{ $countInspection }}" />
                                @endfor
                            </tr>
                        @endforeach
                    </table>
                @endif
            </fieldset>
        @endforeach
    </div>
</div>
