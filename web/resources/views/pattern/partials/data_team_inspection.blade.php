
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
    <table id="" class="table table-bordered">

        {{-- Remove Button --}}
        <tr style="border-color: transparent;">
            <td colspan="3">

            </td>
            @foreach ($inspectionIds as $inspectionId)
            <td style="text-align: center">
                @if (is_int($inspectionId))
                <input style="border-color: transparent; width: 30%; background-color: red; color: aliceblue;" type="button" value="削除" onclick="removeColumn('{{ $inspectionId }}')"/>
                @else
                <input style="border-color: transparent; width: 30%; background-color: red; color: aliceblue;" type="button" value="削除" onclick="removeColumn(-1)"/>
                @endif

            </td>
            @endforeach
        </tr>

        {{-- Radar Chart --}}
        <tr style="height: 200px; border-color: transparent;">
            <td colspan="3" style="text-align: center; padding-top: 77px; font-size: 2rem; background-color: #DAEEF3;">
                ここにイラスト
            </td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <canvas id="myChart_{{ $inspectionId }}"></canvas>
            </td>
            @endforeach
        </tr>

        {{-- Bar Chart --}}
        <tr style="height: 200px; border-color: transparent;">
            <td colspan="3" style="text-align: center; padding-top: 77px; font-size: 2rem; background-color: #FDE9D9;">
                ここにイラスト
            </td>
            @foreach ($inspectionIds as $inspectionId)
                <td colspan="{{ $countInspection }}">
                    {{-- Bar Chart
                    <div id="barchart"></div> --}}
                    <canvas style="width: 15px; height: 10px;" id="myBarChart"></canvas>
                </td>
            @endforeach
        </tr>

        {{-- 改善結果を見る --}}
        <tr style="text-align: center; border-left-color: transparent; border-right-color: transparent;">
            <td colspan="3">

            </td>
            @foreach ($inspectionIds as $inspectionId)
            @php
                $countImgs = isset($inspectionData[$inspectionId]['count_evidence'])
                ? $inspectionData[$inspectionId]['count_evidence'] : 0;
            @endphp
            <td>
                @if (strpos($inspectionId, "new"))
                <input style="width: 100%; border-color: transparent; background-color: #FDE9D9;" type="button" class="btn-success" value="改善結果を見る" onclick=""/>
                @else
                <input style="width: 100%; border-color: transparent; background-color: deepskyblue; color: aliceblue" type="button" class="" value="改善結果を見る" onclick=""/>
                @endif

                <br>
                <a style="color: black;" href="">{{ $countImgs }}件登録済</a>
                <br>
                <a style="color: black;" href="">新しく登録する</a>
            </td>
            @endforeach
        </tr>

        {{-- 平均 --}}
        <tr>
            <td rowspan="5" style="width: 20px">平均</td>
            <td style="width: 50px">整理</td>
            <td style="width: 50px">1S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_1s_{{ $inspectionId }}">Point avg</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td>整頓</td>
            <td>2S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_2s_{{ $inspectionId }}">Point avg</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td>清掃</td>
            <td>3S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_3s_{{ $inspectionId }}">Point avg</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td>清潔</td>
            <td>4S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_4s_{{ $inspectionId }}">Point avg</label>
            </td>
            @endforeach
        </tr>
        <tr>
            <td>躾</td>
            <td>5S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <label id="point_avg_5s_{{ $inspectionId }}">Point avg</label>
            </td>
            @endforeach
        </tr>

        {{-- 点検実施日 --}}
        <tr>
            <td rowspan="2">No</td>
            <td rowspan="2">点検箇所</td>
            <td rowspan="2">ポイント</td>
            @for ($i = 0; $i < $countInspection; $i++)
            <td>
                点検実施日
            </td>
            @endfor
        </tr>
        <tr>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <?php
                    $date = isset($inspectionData[$inspectionId]['inspection_date'])
                    ? $inspectionData[$inspectionId]['inspection_date'] : "";

                ?>
                <input type="text" placeholder="年月日" style="width: 100px" id="txtInspectionDate_{{ $inspectionId }}" value="{{ $date }}" />
                <input type="hidden" id="hidInspectionDate_{{ $inspectionId }}" value="{{ $date }}"/>
                <input type="hidden" id="hidInspectionId_{{ $inspectionId }}" value="{{ $inspectionId }}"/>
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
                <td id="level_tooltip" style="">
                    {{ Constant::NAME_5S[$row['5s']] }}

                    {{-- Tooltip --}}
                    <div id="level" class="" style="display: none; width: 300px">
                        <div>
                            <span>最悪(ﾚﾍﾞﾙ1): </span>
                            <span>{{ $row['level_1'] }}</span>
                        </div>
                        <div>
                            <span>悪い(ﾚﾍﾞﾙ2): </span>
                            <span>{{ $row['level_2'] }}</span>
                        </div>
                        <div>
                            <span>普通(ﾚﾍﾞﾙ3): </span>
                            <span>{{ $row['level_3'] }}</span>
                        </div>
                        <div>
                            <span>良い(ﾚﾍﾞﾙ4): </span>
                            <span>{{ $row['level_4'] }}</span>
                        </div>
                        <div>
                            <span>大変良い(ﾚﾍﾞﾙ5): </span>
                            <span>{{ $row['level_5'] }}</span>
                        </div>
                    </div>
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
                        <option value="{{ $value }}" {{ $selected }} >{{ $value }}</option>
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
