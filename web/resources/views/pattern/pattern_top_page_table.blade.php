<div id="scrolling">
    <div style="width: 100%; height: auto;" id="mainDiv">
        <table id="topPageTable" class="table table-bordered">
            @foreach ($inspectionData as $deptKey => $inspection)
                @if ($deptKey % 3 == 0)
                    <tr id="deptRadarChart">
                @endif
                <td class="width-data pb-2">
                    <button type="button" class="dept-btn" onclick="scrollToDiv({{ $inspection['dept_id'] }})" class="btn" style="border-color: black;">{{ $inspection['dept_name'] }}</button>
                    <canvas class="radarChart" id="radarchart_dept_{{ $inspection['dept_id'] }}"></canvas>
                </td>
                {{-- Hidden --}}
                <input type="hidden" id="hidDeptId_{{ $inspection['dept_id'] }}" value="{{ $inspection['dept_id'] }}"
                data-avgPoint="{{ $inspection['dept_avgPoint'] }}" />

                @if (count($inspection['locationIds']))
                    @foreach ($inspection['locationIds'] as $locationId)
                        <input type="hidden" id="hidLocationId_{{ $locationId }}" value="{{ $locationId }}"/>
                    @endforeach
                @endif
                @if (($deptKey + 1) % 3 == 0 || $loop->last)
                    </tr>
                @endif
            @endforeach
        </table>
        <br>
        <hr>
        <br>
        @foreach ($inspectionData as $inspection)
            @if (count($inspection['teams']))
            <div class="team-chart-area" id="dept_title_{{ $inspection['dept_id'] }}">
                <div class="team-area-title">
                    <h5><strong>{{ $inspection['dept_name'] }}</strong></h5>
                </div>
                <table>
                    @foreach ($inspection['teams'] as $teamKey => $team)
                        @php
                            $inspections = $team['inspections'];
                        @endphp

                        {{-- Radar Chart --}}
                        @if ($teamKey % 3 == 0)
                            <tr class="rows radarChartRow teamRadarChart">
                        @endif
                            <td class="width-data">
                                <canvas class="radarChart"
                                    id="radarchart_team_{{ $team['team_id'] }}">
                                </canvas>
                                <input type="button" class="btn-info rounded-3 toppage-button" id="btnInput"
                                value="{{ $team['team_name'] }}"
                                onclick="gotoInspectionPage('{{ $team['team_id'] }}', {{ $inspection['dept_id'] }})" />
                            </td>
                        @if (($teamKey + 1) % 3 == 0 || $loop->last)
                            </tr>
                        @endif
                    @endforeach
                </table>
            </div>
            <br>
            @endif
        @endforeach

        @foreach ($inspectionData as $teamKey => $inspection)
            @if (count($inspection['teams']))
                <table>
                    @foreach ($inspection['teams'] as $team)
                        @php
                            $inspections = $team['inspections'];
                        @endphp
                        {{-- Hidden --}}
                        <input type="hidden"
                            id="hid_deptId_{{ $inspection['dept_id'] }}_teamId_{{ $team['team_id'] }}-0"
                            value="{{ $team['team_id'] }}" />


                    {{-- 改善結果を見る --}}
                    <tr id="dept_{{ $inspection['dept_id'] }}-team_{{ $team['team_id'] }}-info"
                    style="display: none; height: 3rem;" class="rows btn-row">
                    @for ($i = 0; $i < $countInspection; $i++)
                        @php
                            $countImgs = isset($inspections[$i]['count_evidence']) ? $inspections[$i]['count_evidence'] : 0;
                            $avgPoint = isset($inspections[$i]['avg_point']) ? $inspections[$i]['avg_point'] : '';
                            $inspectionId = isset($inspections[$i]['inspection_id']) ? $inspections[$i]['inspection_id'] : '';
                            $locationIds = isset($inspections[$i]['locationIds']) ? $inspections[$i]['locationIds'] : '';
                        @endphp
                        {{-- Hidden AVG Point (use for render chart) --}}
                        <input type="hidden" id="hidAvgPoint_{{ $i }}"
                            value="{{ $avgPoint }}" />
                        <input type="hidden" id="hidCountInspection" value="{{ $countInspection }}" />
                    @endfor
                    </tr>
                    @endforeach
                </table>
            @endif
        @endforeach
    </div>
</div>
<button id="homeButton" onclick="scrollToDiv()"> <i class="fa fa-arrow-circle-up" aria-hidden="true"> </i> </button>

