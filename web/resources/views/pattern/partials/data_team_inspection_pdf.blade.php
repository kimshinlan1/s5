<?php

$index = 0;
$areas = [];
$locations = [];

?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    {{-- <link rel="stylesheet" href= "{!! url('assets/bootstrap-3.4.1/css/bootstrap.min.css') !!}"/>
    <script src="{!! url('assets/bootstrap-3.4.1/js/bootstrap.min.js') !!}" type="text/javascript"></script> --}}
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

            tr {
                page-break-inside: avoid !important;
            }
            td,
            th {
                border: 1px solid black;
                width: 12.5%;
                height: 30px !important;
                page-break-inside: avoid !important;
                word-wrap: break-word;
                font-size: 16px;
            }
            .point-class {
                text-align: center;
            }
            h1 {
                font-size: 30px;
                font-weight: bolder;
            }
            .level-sub-table {
                padding-right: 0px;
                margin: 0px 15px 0px;
                width: 90%;
                height: 100%;
                border-color: red;
            }
            .tr-sub-table {
                width: 100%;
                height: 100%;
            }
            .td-sub-table {
                width:85%;
                height: 100%;
                padding-left: 10px;
                margin: 0px;
                border-color: transparent;
                border-left-color: black
            }
    </style>
</head>
<body>
    <div>
    <span style="font-size: 20px; margin-right: 15px">{{ $companyName }}</span>
    <span style="font-size: 20px; margin-right: 15px">{{ $departmentName }}</span>
    <span style="font-size: 20px; margin-right: 15px">{{ $teamName }}</span>
</div>
<div style="text-align: center">
    <h1>5Sチェックリスト</h1>
</div>
<table class="data_table" cellspacing="0" cellpadding="0">

    <thead class="table_header">
        <tr style="height: 40.5px;" id="header-2-table-content">
            <th class="value-area" scope="col">点検エリア</th>
            <th class="value-location" scope="col">点検箇所</th>
            <th class="value-5s point-class" scope="col">改善ポイント</th>
            <th class="value-level" scope="col">最悪（レベル１）</th>
            <th class="value-level" scope="col">悪い（レベル2） </th>
            <th class="value-level" scope="col">悪い（レベル3） </th>
            <th class="value-level" scope="col">悪い（レベル4） </th>
            <th class="value-level" scope="col">悪い（レベル5） </th>
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
            @if (!in_array($row['area_id'], $areas))
                <td rowspan="{{ $row['area_rowspan'] }}" class="area"
                    style="background-color: #d8e4bc; text-align:center;">
                    {{ $row['area_name'] }}
                </td>
                <?php $areas[] = $row['area_id']; ?>
            @endif

            {{-- Locations --}}
            @if (!in_array($locaitonIdToCheck, $locations))
                <td rowspan="{{ $row['location_rowspan'] }}" class="location"
                    style="background-color: #d8e4bc; text-align:center; vertical-align: center;">
                    {{ $row['location_name'] }}
                </td>
                <?php $locations[] = $locaitonIdToCheck; ?>
            @endif

            {{-- Point --}}
            <td class="point-class">
                {{ Constant::NAME_5S[$row['5s']] }}
            </td>

            {{-- Levels --}}
            <td>
                <table class="level-sub-table">
                    <tr class="tr-sub-table">
                        <td class="td-sub-table">
                                @if(isset($row['level_1']))
                                    {{ $row['level_1'] }}
                                @else
                                    &nbsp;
                                @endif
                        </td>
                    </tr>
                </table>
            </td>
            <td>
                <table class="level-sub-table">
                    <tr class="tr-sub-table">
                        <td class="td-sub-table">
                                @if(isset($row['level_2']))
                                    {{ $row['level_2'] }}
                                @else
                                    &nbsp;
                                @endif
                        </td>
                    </tr>
                </table>
            </td>
            <td>
                <table class="level-sub-table">
                    <tr class="tr-sub-table">
                        <td class="td-sub-table">
                                @if(isset($row['level_3']))
                                    {{ $row['level_3'] }}
                                @else
                                    &nbsp;
                                @endif
                        </td>
                    </tr>
                </table>
            </td>
            <td>
                <table class="level-sub-table">
                    <tr class="tr-sub-table">
                        <td class="td-sub-table">
                                @if(isset($row['level_4']))
                                    {{ $row['level_4'] }}
                                @else
                                    &nbsp;
                                @endif
                        </td>
                    </tr>
                </table>
            </td>
            <td>
                <table class="level-sub-table">
                    <tr class="tr-sub-table">
                        <td class="td-sub-table">
                                @if(isset($row['level_5']))
                                    {{ $row['level_5'] }}
                                @else
                                    &nbsp;
                                @endif
                        </td>
                    </tr>
                </table>
            </td>

            <?php $index++; ?>

            </tr>
        @endforeach
    </tbody>
</table>

</body>
</html>