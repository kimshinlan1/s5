<script src="{!! url('assets/jquery/chart.min.js') !!}" type="text/javascript"></script>
<script type="text/javascript">
    var inspIds = {{ Js::from($inspectionIds ?? []) }};
</script>
<?php
    $width_data = "50px";
    $areas = [];
    $locations = [];
    $pointValues = Constant::POINT_VALUE_5S;
    $countFirstTime = $countInspection + 1;
    $theFirstTime = Constant::THE_FIRST_TIME;
?>

<div style="width: 100%; height: auto; overflow: auto; " id="scrollTable">
  <form id="formFormsInput">
    {{-- <table id="" class="table table-bordered" style="width: fit-content;"> --}}
    <table id="tableDetailInspection" class="table table-bordered">
        <tr style="border-color: transparent;">
            <td colspan="3" style="text-align: center; padding: 0rem;">
                <input id="addColumnId" class="btn btn-primary btn-add-inspection" type="button" value="{{ __('TeamInspection_Add_Inspection_Point') }}" onclick="addColumn()"/>
            </td>
            @foreach ($inspectionIds as $inspectionId)
            <?php $countFirstTime-- ?>
            <td style="text-align: center; vertical-align: bottom; padding: 0rem;">
                <label><strong>{{ $countFirstTime }}{{ $theFirstTime }}</strong></label>
            </td>
            @endforeach
        </tr>
        {{-- 点検実施日 --}}
        <tr id="hidInspectionRow" style="border-color: transparent;">
            <td colspan="3" class="title-chart" style="vertical-align: middle;">
            @foreach ($inspectionIds as $key => $inspectionId)
            <td style="text-align: center; vertical-align: middle;" data-time="{{ $key }}" class="date_{{ $key + 1}}">
                <?php
                    $date = isset($inspectionData[$inspectionId]['inspection_date'])
                    ? $inspectionData[$inspectionId]['inspection_date'] : "";
                ?>
                <label><strong>点検実施日</strong></label>
                <br>
                <input type="text" placeholder="年月日" style="width: 170px; text-align: center; border-radius: 6px;" id="txtInspectionDate_{{ $inspectionId }}" value="{{ $date }}" />
                <input type="hidden" id="hidInspectionDate_{{ $inspectionId }}" value="{{ $date }}"/>
                <input type="hidden" class="hidInspectionClass" id="hidInspectionId_{{ $inspectionId }}" value="{{ $inspectionId }}"/>
            </td>
            @endforeach
        </tr>
        {{-- Remove Button --}}
        <tr style="border-color: transparent;">
            <td colspan="3" class="title-chart" style="vertical-align: middle;">
            @foreach ($inspectionIds as $inspectionId)
            <?php $countFirstTime-- ?>
            <td style="text-align: center">
                <input class="btn-remove-column" style="width: 3rem" type="button" value="{{ __('Common_Delete') }}" onclick="removeColumn('{{ $inspectionId }}')"/>
            </td>
            @endforeach
        </tr>

        {{-- Radar Chart --}}
        <tr style="height: 220px; max-height:220px; border-color: transparent;">
            <td colspan="3" class="title-chart" style="vertical-align: middle;">
            </td>
            @foreach ($inspectionIds as $inspectionId)
            <td style="text-align: -webkit-center;">
                <canvas id="myChart_{{ $inspectionId }}" class="radarChart"></canvas>
            </td>
            @endforeach
        </tr>

        {{-- Bar Chart --}}
        {{-- <tr style="height: 220px; max-height:220px; border-color: transparent;">
            <td colspan="3" class="title-chart" style="vertical-align: middle;">
            </td>
            <td style="padding: 0px;" colspan="{{ $countInspection }}">
                <canvas id="myBarChart" class="myBarChart" height= "220px"></canvas>
            </td>
        </tr> --}}

        {{-- 改善結果を見る --}}
        <tr class="tr-row-evidence">
            <td colspan="3">

            </td>
            @foreach ($inspectionIds as $key => $inspectionId)
            @php
                $countImgs = isset($inspectionData[$inspectionId]['count_evidence'])
                ? $inspectionData[$inspectionId]['count_evidence'] : 0;
            @endphp
            <td>
                @if ($countImgs < 1)
                <input style="width: 12rem;" data-countEvidenceId="countEvidence_{{ $inspectionId }}" id="openEvidenceBtn{{ $key }}" data-time="{{ $key }}" data-id="{{ is_int($inspectionId) ? $inspectionId : null }}" type="button" class="btn-secondary btn-evidence1 rounded-3 openEvidenceBtn" value="{{ __('TeamInspection_Redirect_Inspection_Button') }}" onclick=""  data-bs-toggle="modal" data-bs-target="#patternEvidenceDialog" disabled/>
                @else
                <input style="width: 12rem;" data-countEvidenceId="countEvidence_{{ $inspectionId }}" id="openEvidenceBtn{{ $key }}" data-time="{{ $key }}" data-id="{{ is_int($inspectionId) ? $inspectionId : null }}" type="button" class="btn-evidence btn-evidence1 rounded-3 openEvidenceBtn" value="{{ __('TeamInspection_Redirect_Inspection_Button') }}" onclick="" data-bs-toggle="modal" data-bs-target="#patternEvidenceDialog"/>
                @endif
                <br>
                <a style="color: black; text-decoration: none;" class="openEvidenceBtn" id="countEvidence_{{ $inspectionId }}" data-time="{{ $key }}" data-id="{{ is_int($inspectionId) ? $inspectionId : null }}" data-countEvidenceId="countEvidence_{{ $inspectionId }}" data-count="{{ $countImgs }}" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#patternEvidenceDialog">{{ $countImgs }}{{ __('TeamInspection_Registered') }}</a>
                <br>
                <a style="color: black;" href="javascript:void(0)" data-countEvidenceId="countEvidence_{{ $inspectionId }}" id="openEvidenceBtn" data-time={{ $key }} data-id="{{ is_int($inspectionId) ? $inspectionId : null }}" data-bs-toggle="modal" data-bs-target="#patternEvidenceDialog">{{ __('TeamInspection_Register_New') }}</a>
            </td>
            @endforeach
        </tr>

        {{-- 平均 --}}
        <tr>
            <td rowspan="5" style="width: 20px; text-align: center; background: #F2F2F2;">平均</td>
            <td style="width: 30px; text-align: center; background: #F2F2F2;">整理</td>
            <td style="width: 30px; text-align: center; background: #F2F2F2;">1S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_1s_{{ $inspectionId }}">0</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td style="text-align: center; background: #F2F2F2;">整頓</td>
            <td style="text-align: center; background: #F2F2F2;">2S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_2s_{{ $inspectionId }}">0</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td style="text-align: center; background: #F2F2F2;">清掃</td>
            <td style="text-align: center; background: #F2F2F2;">3S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_3s_{{ $inspectionId }}">0</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td style="text-align: center; background: #F2F2F2;">清潔</td>
            <td style="text-align: center; background: #F2F2F2;">4S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_4s_{{ $inspectionId }}">0</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td style="text-align: center; background: #F2F2F2;">躾</td>
            <td style="text-align: center; background: #F2F2F2;">5S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_5s_{{ $inspectionId }}">0</label>
            </td>
            @endforeach
        </tr>

        <tr style="background: #F2F2F2;">
            <td style="text-align: center; vertical-align: middle;">点検エリア</td>
            <td style="text-align: center; vertical-align: middle;">点検箇所</td>
            <td style="text-align: center; vertical-align: middle; min-width: 95px">改善ポイント</td>
            <td style="text-align: center; vertical-align: middle;" colspan="{{ $countInspection }}">
            </td>
        </tr>

        {{-- Pattern List --}}
        @foreach ($data as $key => $row)

            <?php
                $locaitonIdToCheck = $row['area_id'] . $row['location_id'];
                $index = $row['area_id'] . "_" . $row['location_id'] . "_" . $row['5s'];
                $areaLocationIndex = $row['area_id'] . "_" . $row['location_id'];
            ?>

            @if (!in_array($row['area_id'], $areas))
            <tr id="" class="main_area main_location">
            @elseif (!in_array($locaitonIdToCheck, $locations))
            <tr id="" class="main_location">
            @else
            <tr id="" class="">
            @endif

                {{-- Area --}}
                @if (!in_array($row['area_id'], $areas))
                <td rowspan="{{ $row['area_rowspan'] }}" class="area" style="text-align: center">
                    {{ $row['area_name'] }}
                </td>
                <?php $areas[] = $row['area_id'] ?>

                {{-- Hidden --}}
                <input type="hidden" id="hidAreaId" value="{{ $row['area_id'] }}"/>
                @endif

                {{-- Locations --}}
                @if (!in_array($locaitonIdToCheck, $locations))
                <td rowspan="{{ $row['location_rowspan'] }}" class="location" style="text-align: center">
                    {{ $row['location_name'] }}
                </td>
                <?php $locations[] = $locaitonIdToCheck ?>

                {{-- Hidden --}}
                <input type="hidden" id="hidLocationId_{{ $row['location_id'] }}" value="{{ $row['location_id'] }}"/>
                <input type="hidden" id="hidAreaLocationIndex_{{ $row['location_id'] }}" value="{{ $areaLocationIndex }}"/>
                @endif

                {{-- Point --}}
                <td id="level_tooltip" style="text-align: center">
                    {{ Constant::NAME_5S[$row['5s']] }}
                </td>
                {{-- Point Value --}}
                @foreach ($inspectionIds as $key => $inspectionId)
                <td class="col_order_{{ $key }}">
                    <select class="form-select selPointValue" id="selPointValue-{{ $inspectionId .'-'. $index }}" data-5s="{{ $row['5s'] }}" data-inspection_id="{{ $inspectionId }}">
                        @foreach ($pointValues as $value)
                        <?php
                            $selected = (isset($inspectionData[$inspectionId][$index])
                                        && $inspectionData[$inspectionId][$index] == $value)
                                        ? 'selected' : '';
                        ?>
                        <option value="{{ $value }}" {{ $selected }} >
                            <?php if ($value == 1): ?>
                                {{ $value }}: {{ $row['level_1'] ? $row['level_1'] : __('TeamInspection_None_Config') }}
                            <?php elseif ($value == 2): ?>
                                {{ $value }}: {{ $row['level_2'] ? $row['level_2'] : __('TeamInspection_None_Config') }}
                            <?php elseif ($value == 3): ?>
                                {{ $value }}: {{ $row['level_3'] ? $row['level_3'] : __('TeamInspection_None_Config') }}
                            <?php elseif ($value == 4): ?>
                                {{ $value }}: {{ $row['level_4'] ? $row['level_4'] : __('TeamInspection_None_Config') }}
                            <?php else: ?>
                                {{ $value }}: {{ $row['level_5'] ? $row['level_5'] : __('TeamInspection_None_Config') }}
                            <?php endif; ?>
                        </option>
                        @endforeach
                    </select>
                </td>
                @endforeach

            </tr>
        @endforeach

    </table>
  </form>
</div>
<button id="homeButton" onclick="scrollToDiv()"> <i class="fa fa-arrow-circle-up" aria-hidden="true"> </i> </button>
{{-- Hidden --}}
<input type="hidden" id="hidCountInspection" value="{{ $countInspection }}"/>
