

<?php
    $width_data = "50px";
    $areas = [];
    $locations = [];
    $pointValues = Constant::POINT_VALUE_5S;

?>

<div style="width: 100%; height: auto; overflow: auto; ">

    <table id="" class="table table-bordered" style="width: fit-content;">

        {{-- Radar Chart --}}
        <tr>
            <td colspan="3">
                ここにイラスト
            </td>
            @for ($i = 0; $i < $countInspection; $i++)
            <td style="width: {{ $width_data }}">
                Radar Chart
                <div id="radarchart_{{ $i }}"></div>
            </td>
            @endfor
        </tr>

        {{-- Bar Chart --}}
        <tr>
            <td colspan="3">
                ここにイラスト
            </td>
            <td colspan="{{ $countInspection }}">
                Bar Chart
                <div id="barchart"></div>
            </td>
        </tr>

        {{-- 改善結果を見る --}}
        <tr>
            <td colspan="3">

            </td>
            @foreach ($inspectionIds as $inspectionId)
            @php
                $countImgs = isset($inspectionData[$inspectionId]['count_evidence'])
                ? $inspectionData[$inspectionId]['count_evidence'] : 0;
            @endphp
            <td>
                @if (strpos($inspectionId, "new"))
                <input type="button" class="btn-success" value="改善結果を見る" onclick=""/>
                @else
                <input type="button" class="" value="改善結果を見る" onclick=""/>
                @endif

                <br>
                <a href="">{{ $countImgs }}件登録済</a>
                <br>
                <a href="">新しく登録する</a>
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
                <span id="point_avg_1s_{{ $inspectionId }}">Point avg</span>
            </td>
            @endforeach
        </tr>
        <tr>
            <td>整頓</td>
            <td>2S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <span id="point_avg_2s_{{ $inspectionId }}">Point avg</span>
            </td>
            @endforeach
        </tr>
        <tr>
            <td>清掃</td>
            <td>3S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <span id="point_avg_3s_{{ $inspectionId }}">Point avg</span>
            </td>
            @endforeach
        </tr>
        <tr>
            <td>清潔</td>
            <td>4S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <span id="point_avg_4s_{{ $inspectionId }}">Point avg</span>
            </td>
            @endforeach
        </tr>
        <tr>
            <td>躾</td>
            <td>5S</td>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <span id="point_avg_5s_{{ $inspectionId }}">Point avg</span>
            </td>
            @endforeach
        </tr>

        {{-- 点検実施日 --}}
        <tr>
            <td rowspan="3">No</td>
            <td rowspan="3">点検箇所</td>
            <td rowspan="3">ポイント</td>
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
                <input type="text" placeholder="年月日" style="width: 100px" value="{{ $date }}" />
                <input type="hidden" id="" value="{{ $date }}"/>
            </td>
            @endforeach
        </tr>
        <tr>
            @foreach ($inspectionIds as $inspectionId)
            <td>
                <input type="button" value="削除" onclick="removeColumn('{{ $inspectionId }}')"/>
            </td>
            @endforeach
        </tr>

        {{-- Pattern List --}}
        @foreach ($data as $key => $row)

            <?php
                $locaitonIdToCheck = $row['area_id'] . $row['location_id'];
                $index = $row['area_id'] . "_" . $row['location_id'] . "_" . $row['5s'];
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
                <input type="hidden" id="hidLocationId" value="{{ $row['location_id'] }}"/>
                @endif

                {{-- Point --}}
                <td id="level_tooltip" style="">
                    {{ Constant::NAME_5S[$row['5s']] }}

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

                @foreach ($inspectionIds as $inspectionId)
                <td>
                    <select class="form-select">
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

</div>
