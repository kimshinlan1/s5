
<script src="{!! url('assets/jquery/chart.min.js') !!}" type="text/javascript"></script>
<script type="text/javascript">
    var inspIds = {{ Js::from($inspectionIds ?? []) }};
</script>
<?php
    $width_data = "50px";
    $areas = [];
    $locations = [];
    $pointValues = Constant::POINT_VALUE_5S;
?>

<div style="width: 100%; height: auto; overflow: auto; ">
  <form id="formFormsInput">
    {{-- <table id="" class="table table-bordered" style="width: fit-content;"> --}}
    <table id="tableDetailInspection" class="table table-bordered">
        {{-- Remove Button --}}
        <tr style="border-color: transparent;">
            <td colspan="3">

            </td>
            @foreach ($inspectionIds as $inspectionId)
            <td style="text-align: center">
                @if (is_int($inspectionId))
                <input class="btn-remove-column" type="button" value="{{ __('Common_Delete') }}" onclick="removeColumn('{{ $inspectionId }}')"/>
                @else
                <input class="btn-remove-column" type="button" value="{{ __('Common_Delete') }}" onclick="removeColumn(-1)"/>
                @endif

            </td>
            @endforeach
        </tr>

        {{-- Radar Chart --}}
        <tr style="border-color: transparent;">
            <td colspan="3" class="title-chart" style="background-color: #DAEEF3; vertical-align: middle;">
                {{ __('TeamInspection_Illustration_Here') }}
            </td>
            @foreach ($inspectionIds as $inspectionId)
            <td style="text-align: -webkit-center;">
                <canvas id="myChart_{{ $inspectionId }}" height= "150px" width= "150px"></canvas>
            </td>
            @endforeach
        </tr>

        {{-- Bar Chart --}}
        <tr style="height: 200px; border-color: transparent;">
            <td colspan="3" class="title-chart" style="background-color: #FDE9D9; vertical-align: middle;">
                {{ __('TeamInspection_Illustration_Here') }}
            </td>
            <td style="padding: 0px;" colspan="{{ $countInspection }}">
                <canvas id="myBarChart" height= "200px"></canvas>
            </td>
        </tr>

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
                @if (strpos($inspectionId, "new"))
                <input style="background-color: #FDE9D9;" type="button" class="btn-success btn-evidence" value="{{ __('TeamInspection_Redirect_Inspection_Button') }}" onclick=""/>
                @else
                <input style="background-color: deepskyblue; color: aliceblue" type="button" class="btn-evidence" value="{{ __('TeamInspection_Redirect_Inspection_Button') }}" onclick=""/>
                @endif

                <br>
                <a style="color: black;" id="countEvidence_{{ $inspectionId }}" href="#">{{ $countImgs }}{{ __('TeamInspection_Registered') }}</a>
                <br>
                {{-- <a style="color: black;" href="javascript:evidenceDialog('{{ is_int($inspectionId) ? $inspectionId : null }}')" >新しく登録する</a> --}}
                <a style="color: black;" href="javascript:void(0)" id="openEvidenceBtn" data-time={{ $key }} data-id="{{ is_int($inspectionId) ? $inspectionId : null }}" data-bs-toggle="modal" data-bs-target="#patternEvidenceDialog" >{{ __('TeamInspection_Register_New') }}</a>

            </td>
            @endforeach
        </tr>

        {{-- 平均 --}}
        <tr>
            <td rowspan="5" style="width: 20px">平均</td>
            <td style="width: 30px; text-align: center;">整理</td>
            <td style="width: 30px">1S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_1s_{{ $inspectionId }}">0</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td style="text-align: center;">整頓</td>
            <td>2S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_2s_{{ $inspectionId }}">0</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td style="text-align: center;">清掃</td>
            <td>3S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_3s_{{ $inspectionId }}">0</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td style="text-align: center;">清潔</td>
            <td>4S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_4s_{{ $inspectionId }}">0</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td style="text-align: center;">躾</td>
            <td>5S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_5s_{{ $inspectionId }}">0</label>
            </td>
            @endforeach
        </tr>

        {{-- 点検実施日 --}}
        <tr>
            <td rowspan="2">No</td>
            <td rowspan="2" style="text-align: center;">点検箇所</td>
            <td rowspan="2">ポイント</td>
            @for ($i = 0; $i < $countInspection; $i++)
            <td style="text-align: center;">
                <strong>点検実施日</strong>
            </td>
            @endfor
        </tr>
        <tr id="hidInspectionRow">
            @foreach ($inspectionIds as $key => $inspectionId)
            <td style="text-align: center; vertical-align: middle;" data-time="{{  $key }}">
                <?php
                    $date = isset($inspectionData[$inspectionId]['inspection_date'])
                    ? $inspectionData[$inspectionId]['inspection_date'] : "";

                ?>
                <input type="text" placeholder="年月日" style="width: 170px; text-align: center; border-radius: 6px;" id="txtInspectionDate_{{ $inspectionId }}" value="{{ $date }}" />
                <input type="hidden" id="hidInspectionDate_{{ $inspectionId }}" value="{{ $date }}"/>
                <input type="hidden" class="hidInspectionClass" id="hidInspectionId_{{ $inspectionId }}" value="{{ $inspectionId }}"/>
            </td>
            @endforeach
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
                <td rowspan="{{ $row['area_rowspan'] }}" class="area">
                    {{ $row['area_name'] }}
                </td>
                <?php $areas[] = $row['area_id'] ?>

                {{-- Hidden --}}
                <input type="hidden" id="hidAreaId" value="{{ $row['area_id'] }}"/>
                @endif

                {{-- Locations --}}
                @if (!in_array($locaitonIdToCheck, $locations))
                <td rowspan="{{ $row['location_rowspan'] }}" class="location">
                    {{ $row['location_name'] }}
                </td>
                <?php $locations[] = $locaitonIdToCheck ?>

                {{-- Hidden --}}
                <input type="hidden" id="hidLocationId_{{ $row['location_id'] }}" value="{{ $row['location_id'] }}"/>
                <input type="hidden" id="hidAreaLocationIndex_{{ $row['location_id'] }}" value="{{ $areaLocationIndex }}"/>
                @endif

                {{-- Point --}}
                <td id="level_tooltip">
                    {{ Constant::NAME_5S[$row['5s']] }}
                </td>
                {{-- Point Value --}}
                @foreach ($inspectionIds as $inspectionId)
                <td>
                    <select class="form-select selPointValue" id="selPointValue-{{ $inspectionId .'-'. $index }}" data-5s="{{ $row['5s'] }}" data-inspection_id="{{ $inspectionId }}">
                        @foreach ($pointValues as $value)
                        <?php
                            $selected = (isset($inspectionData[$inspectionId][$index])
                                        && $inspectionData[$inspectionId][$index] == $value)
                                        ? 'selected' : '';
                        ?>
                        <option value="{{ $value }}" {{ $selected }} >
                            <? if ($value == 1): ?>
                                {{ $value }}: {{ $row['level_1'] ? $row['level_1'] : __('TeamInspection_None_Config') }}
                            <? elseif ($value == 2): ?>
                                {{ $value }}: {{ $row['level_2'] ? $row['level_2'] : __('TeamInspection_None_Config') }}
                            <? elseif ($value == 3): ?>
                                {{ $value }}: {{ $row['level_3'] ? $row['level_3'] : __('TeamInspection_None_Config') }}
                            <? elseif ($value == 4): ?>
                                {{ $value }}: {{ $row['level_4'] ? $row['level_4'] : __('TeamInspection_None_Config') }}
                            <? else: ?>
                                {{ $value }}: {{ $row['level_5'] ? $row['level_5'] : __('TeamInspection_None_Config') }}
                            <? endif; ?>
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

{{-- Hidden --}}
<input type="hidden" id="hidCountInspection" value="{{ $countInspection }}"/>
