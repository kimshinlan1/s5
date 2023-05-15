<?php

$index = 0;
$areas = [];
$locations = [];
$locationIndex = 0;
$areaIndex = 0;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>{{ $teamName }} PDF</title>
    <style>
        @font-face {
            font-family: 'yugothib';
            font-style: normal;
            font-weight: normal;
            src: url("{{ public_path('assets/font/yu-gothic/yugothib.ttf') }}") format('truetype');
        }

        * {
            font-family: 'yugothib';
            font-size: 10px;
        }

        body {
            font-family: 'yugothib';
        }

        table {
            border-collapse: collapse;
            margin: auto;
            width: 100%;
            table-layout: fixed;
        }

        td {
            border: 1px solid black;
            width: 12.5%;
            height: 30px !important;
            word-wrap: break-word;
            font-size: 12px;
        }

        th {
            border: 1px solid black;
            height: 30px !important;
            word-wrap: break-word;
            font-size: 14px;
            font-weight: bolder;
        }

        .point-class {
            text-align: center;
            width: 5% !important;
        }

        .value-area .value-location {
            text-align: center;
            width: 5% !important;
        }

        .value-location {
            text-align: center;
            width: 5% !important;
        }

        h1 {
            font-size: 30px;
            font-weight: bolder;
        }

        .level-td {
            padding-left: 10px;
            vertical-align: center;
        }

        .empty-col {
            width: 2% !important;
        }

        .area {
            background-color: #d8e4bc;
            text-align:center;
            vertical-align: center;
            border-bottom-color: #d8e4bc;
        }

        .area-last {
            background-color: #d8e4bc;
            text-align:center;
            vertical-align: center;
            border-top-color: #d8e4bc;
        }

        .location {
            background-color: #d8e4bc;
            text-align:center;
            vertical-align: center;
            border-bottom-color: #d8e4bc;
            border-top-color: #d8e4bc;
        }

        .location-last {
            background-color: #d8e4bc;
            text-align:center;
            vertical-align: center;
            border-top-color: #d8e4bc
        }

        .comp-dept-team {
            font-size: 18px;
            margin-right: 20px;
        }

    </style>
</head>

<body>
    <div style="margin-bottom: 10px;">
        <span class="comp-dept-team">{{ $companyName }}</span>
        <span class="comp-dept-team">{{ $departmentName }}</span>
        <span class="comp-dept-team">{{ $teamName }}</span>
        <div style="text-align: center; font-size: 20px; font-weight: bold;">
            {{ __('TeamInspection_PDF_Title') }}
        </div>
    </div>

    <table class="data_table" cellspacing="0" cellpadding="0">

        <thead class="table_header">
            <tr style="height: 40.5px;" id="header-2-table-content">
                <th class="value-area" scope="col">{{ __('Pattern_Detail_Area') }}</th>
                <th class="value-location" scope="col">{{ __('Pattern_Detail_Location') }}</th>
                <th class="value-5s point-class" scope="col">{{ __('Pattern_Detail_Point') }}</th>
                <th colspan="2" class="value-level" scope="col">{{ __('Pattern_Detail_Level_1') }}</th>
                <th colspan="2" class="value-level" scope="col">{{ __('Pattern_Detail_Level_2') }} </th>
                <th colspan="2" class="value-level" scope="col">{{ __('Pattern_Detail_Level_3') }} </th>
                <th colspan="2" class="value-level" scope="col">{{ __('Pattern_Detail_Level_4') }} </th>
                <th colspan="2" class="value-level" scope="col">{{ __('Pattern_Detail_Level_5') }} </th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $key => $row)
                <?php $locaitonIdToCheck = $row['area_id'] . $row['location_id']; ?>

                @if (!in_array($row['area_id'], $areas))
                    <tr id="area_{{ $row['area_id'] }}_location_{{ $row['location_id'] }}_row_{{ $index }}"
                        class="main_area main_location">
                    @elseif (!in_array($locaitonIdToCheck, $locations))
                    <tr id="area_{{ $row['area_id'] }}_location_{{ $row['location_id'] }}_row_{{ $index }}"
                        class="main_location">
                    @else
                    <tr id="area_{{ $row['area_id'] }}_location_{{ $row['location_id'] }}_row_{{ $index }}"
                        class="">
                @endif

                {{-- Area --}}
                @if ($areaIndex++ < $row['area_rowspan'] - 1)
                    @if ($areaIndex - 1 == 0)
                        <td class="area">
                            {{ $row['area_name'] }}
                        </td>
                    @else
                        <td class="area"></td>
                    @endif

                    <?php $locations[] = $locaitonIdToCheck; ?>
                @else
                    <?php $areaIndex = 0; ?>
                    <td class="area-last"></td>
                @endif

                {{-- Locations --}}
                @if ($locationIndex++ < $row['location_rowspan'] - 1)
                    @if ($locationIndex - 1 == 0)
                        <td class="location">
                            {{ $row['location_name'] }}
                        </td>
                    @else
                        <td class="location"></td>
                    @endif
                    <?php $locations[] = $locaitonIdToCheck; ?>
                @else
                    <?php $locationIndex = 0; ?>
                    <td class="location-last"></td>
                @endif

                {{-- Point --}}
                <td class="point-class">
                    {{ Constant::NAME_5S[$row['5s']] }}
                </td>

                {{-- Levels --}}
                <td class="empty-col">
                    &nbsp;
                </td>
                <td class="level-td">
                    @if (isset($row['level_1']))
                        {{ $row['level_1'] }}
                    @else
                        {{ __('TeamInspection_None_Config') }}
                    @endif
                </td>
                <td class="empty-col">
                    &nbsp;
                </td>
                <td class="level-td">
                    @if (isset($row['level_2']))
                        {{ $row['level_2'] }}
                    @else
                        {{ __('TeamInspection_None_Config') }}
                    @endif
                </td>
                <td class="empty-col">
                    &nbsp;
                </td>
                <td class="level-td">
                    @if (isset($row['level_3']))
                        {{ $row['level_3'] }}
                    @else
                        {{ __('TeamInspection_None_Config') }}
                    @endif
                </td>
                <td class="empty-col" &nbsp; </td>
                <td class="level-td">
                    @if (isset($row['level_4']))
                        {{ $row['level_4'] }}
                    @else
                        {{ __('TeamInspection_None_Config') }}
                    @endif
                </td>
                <td class="empty-col">
                    &nbsp;
                </td>
                <td class="level-td">
                    @if (isset($row['level_5']))
                        {{ $row['level_5'] }}
                    @else
                        {{ __('TeamInspection_None_Config') }}
                    @endif
                </td>
                <?php $index++; ?>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
