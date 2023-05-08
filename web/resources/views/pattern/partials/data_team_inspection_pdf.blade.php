<?php

$index = 0;
$areas = [];
$locations = [];

?>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        {
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

            td,
            th {
                border: 1px solid black;
                width: 20%;
                height: 30px;
                page-break-inside: avoid;
                word-wrap: break-word;
            }
            h1 {
                page-break-before: always;
            }

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
    <h1 style="font-size: 20px">5Sチェックリスト</h1>
</div>
<table class="data_table" cellspacing="0" cellpadding="0">

    <thead class="table_header">
        <tr style="height: 40.5px;" id="header-2-table-content">
            <th class="value-area" scope="col">点検エリア</th>
            <th class="value-location" scope="col">点検箇所</th>
            <th class="value-5s" scope="col">改善ポイント</th>
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
                    style="background-color: #d8e4bc; text-align:center; page-break-inside: avoid;">
                    {{ $row['area_name'] }}
                </td>
                <?php $areas[] = $row['area_id']; ?>
            @endif

            {{-- Locations --}}
            @if (!in_array($locaitonIdToCheck, $locations))
                <td rowspan="{{ $row['location_rowspan'] }}" class="location"
                    style="background-color: #d8e4bc; text-align:center; page-break-inside: avoid; ">
                    {{ $row['location_name'] }}
                </td>
                <?php $locations[] = $locaitonIdToCheck; ?>
            @endif

            {{-- Point --}}
            <td>
                {{ Constant::NAME_5S[$row['5s']] }}
            </td>

            {{-- Levels --}}
            <td>
                <table style=" padding-right: 0px; margin-left: 15px; margin-right: 0px; width:100%">
                    <tr style="width:100%">
                        <td
                            style=" width:85%; border:none;border-left: 1px solid; padding-left: 10px; margin-right: 0px;">
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
                <table style=" padding-right: 0px; margin-left: 15px; margin-right: 0px; width:100%">
                    <tr style="width:100%">
                        <td
                            style=" width:85%; border:none;border-left: 1px solid; padding-left: 10px; margin-right: 0px;">
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
                <table style=" padding-right: 0px; margin-left: 15px; margin-right: 0px; width:100%">
                    <tr style="width:100%">
                        <td
                            style=" width:85%; border:none;border-left: 1px solid; padding-left: 10px; margin-right: 0px;">
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
                <table style=" padding-right: 0px; margin-left: 15px; margin-right: 0px; width:100%">
                    <tr style="width:100%">
                        <td
                            style=" width:85%; border:none;border-left: 1px solid; padding-left: 10px; margin-right: 0px;">
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
                <table style=" padding-right: 0px; margin-left: 15px; margin-right: 0px; width:100%">
                    <tr style="width:100%">
                        <td
                            style=" width:85%; border:none;border-left: 1px solid; padding-left: 10px; margin-right: 0px;">
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
