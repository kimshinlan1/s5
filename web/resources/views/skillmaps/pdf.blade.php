<style>
    @font-face {
        font-family: 'yugothib';
        font-style: normal;
        font-weight: normal;
        src: url('assets/font/yu-gothic/yugothib.ttf') format('truetype');
    }

    * {
        font-family: 'yugothib';
        font-size: 10px;
    }

    table {
        table-layout: fixed;
    }

    th, td {
        word-wrap: break-word;
    }

    .sub_title {
        font-size: 14px;
        width: 100%;
    }

    .title {
        font-size: 20px;
        color: rgb(11, 123, 123);
        text-decoration: underline;
    }

    .sub_title_2 {
        font-size: 10px;
        width: 100%;
    }

    .icon_legend {
        width: 10;
        height: 10;
    }

    img {
        display: block;
        page-break-inside: avoid;
    }

    .data_table {
        width: 100%;
        min-width:100%;
        max-width:100%;
        padding-top: 15px;
    }

    .data_header {
        background-color: rgb(233, 236, 239);
        color: black;
        text-align: center;
        vertical-align: middle;
    }

    .height_header {
        height: 33.5px;
    }

    .data_header th {
        text-align: center;
        vertical-align: middle;
        padding-left: 1px;
        padding-right: 1px;
        padding-top: 2px;
        padding-bottom: 2px;
    }

    .data_table th,
    .data_table td {
        border: 0.1px solid #CED4DA;
    }

    .data_table tbody tr,
    .data_table tbody td {
        vertical-align: middle;
    }

    .cell-height {
        text-align: center;
        vertical-align: middle;
    }

    .left-text {
        text-align: left;
        padding-left: 5px;
    }

    .container {
        background-color: rgb(192, 192, 192);
        width: auto;
        margin: 5px;
    }

    .progress {
        color: white;
        padding-left: 1%;
        padding-bottom: 5px;
        white-space: nowrap;
    }

</style>

<head>
	<title> {{ $titleFileName }}_pdf</title>
</head>

{{-- Logo --}}
@if (auth()->user()->isModeFree())
<table style="width: 100%; margin-top: -30px;">
    <tr>
        <td></td>
        <td style="width: 20%;">
            <span style="font-size: 10px; font-weight: lighter; white-space: nowrap; margin-left: 10px; color: gray">Produced By</span><br>
        </td>
    </tr>
    <tr>
        <td></td>
        <td style="width: 20%;" align="right">
            <img alt="" src="{!! 'assets/img/kaisebase_logo.jpg' !!}" width="100%" style="display: block" />
        </td>
    </tr>
</table>
@endif

{{-- Title / Legend --}}
<table class="sub_title">
    <tr style="vertical-align: top">
        <td class="title" >
            <p style="margin-top: -10px; font-size: 20px">
                {{ $department }} {{ $lineName }}
                {{ __('SkillMap_PDF_Title') }}
            </p>
        </td>
        <td style="width: 20%; text-indent: 20px; font-weight: lightest; color: gray; font-size: 12px">
            {{ __('Common_Created_Date') }}: {!! $dateFrom !!}<br>
            {{ __('Common_Last_Update_Date') }}: {!! $dateTo !!}
        </td>
        <td style="width: 30%; ">
            <img alt="" class="icon_legend" src="{!! 'assets/img/skill-1.png' !!}"/>{{ __('SkillMap_label_5') }}<br>
            <img alt="" class="icon_legend" src="{!! 'assets/img/skill-2.png' !!}"/>{{ __('SkillMap_label_6') }}<br>
            <img alt="" class="icon_legend" src="{!! 'assets/img/skill-3.png' !!}"/>{{ __('SkillMap_label_7') }}<br>
            <img alt="" class="icon_legend" src="{!! 'assets/img/skill-4.png' !!}"/>{{ __('SkillMap_label_8') }}
        </td>
    </tr>
</table>

{{-- Skill up --}}
<table class="sub_title_2">
    <tr>
        <td style="width: 20%; text-align: left;">
            <table style="width: 100%; padding: 0px">
                <tr>
                    <td style="width: 20%;">
                        <div style="background-color: #F6DDC2; height: 15px; border: black solid 1px"></div>
                    </td>&nbsp;&nbsp;
                    <td style="width: 85%; text-align: left; font-size: 0.8em;">
                        {{ __("SkillMap_Up_Note_1") }}
                    </td>
                </tr>
            </table>
        </td>
        <td style="width: 20%">
            <table style="width: 100%; padding: 0px">
                <tr>
                    <td style="width: 20%;">
                        <div style="background-color: #F0AE66; height: 15px; border: black solid 1px"></div>
                    </td>&nbsp;&nbsp;
                    <td style="width: 85%; text-align: left; font-size: 0.8em;">
                        {{ __("SkillMap_Up_Note_2") }}
                    </td>
                </tr>
            </table>
        </td>
        <td style="width: 25%">
        </td>
        <td style="width: auto">
        </td>
    </tr>
</table>

{{-- Data table --}}
<table class="data_table" cellspacing="0" cellpadding="0">
    <thead>
        <tr class="data_header">
            <th scope="col" colspan="5" class="height_header">{{ __('SkillMap_Header_Item') }}</th>
            <th scope="col" colspan="{!! $header_employees_count !!}" class="height_header">{{ __('SkillMap_Header_EmployeeName') }}</th>
            <th scope="col" colspan="3" class="height_header">{{ __('SkillMap_Header_TotalScore') }}</th>
        </tr>
        <tr class="data_header" style="line-height: 8px;">
            <th scope="col">{{ __('SkillMap_Header_CategoryName') }}</th>
            <th scope="col">{{ __('SkillMap_Header_No') }}</th>
            <th scope="col">{{ __('SkillMap_Header_SkillName') }}</th>
            <th style="word-break: break-all; width: 3.6%;" scope="col">{{ __('SkillMap_Header_DifficultLevel') }}</th>
            <th scope="col">{{ __('SkillMap_Header_ExperiencedMonth') }}</th>

            @foreach($header_employees as $i => $employee)
                <th scope="col">{!! nl2br(e($employee))!!}</th>
            @endforeach

            <th scope="col">{{ __('SkillMap_Header_RequiredNumber') }}</th>
            <th scope="col">{{ __('SkillMap_Header_TrainedNumber') }}</th>
            <th scope="col">{{ __('SkillMap_Header_Progress') }}</th>
        </tr>
    </thead>

    <tbody>
        @foreach($data as $i => $rows)
            @foreach($rows as $row)
                <tr>
                    @if ($row['categoryColumn'] == 1)
                        <td align="center" style="width: 8%;border-bottom: 0.1px solid white;">
                            {{ $row['category_name'] }}
                        </td>
                    @elseif($row['categoryColumn'] == 2)
                        <td align="center" style="width: 8%;border-bottom: 0.1px solid white;"></td>
                    @else
                        <td align="center" style="width: 8%;border-top: 0.1px solid white;">
                            @if ($row['displayName'])
                                {{ $row['category_name'] }}
                            @endif
                        </td>
                    @endif
                    <td align="center" style="width: 3%">
                        {!! $row['no'] !!}
                    </td>
                    <td class="left-text" style="text-align: left; width: 12%">
                        {!! $row['skill_name'] !!}
                    </td>
                    <td align="center" style="width: 3%">
                        {!! $row['difficult_level'] !!}
                    </td>
                    <td align="center" style="width: 4%">
                        {!! $row['experienced_month'] !!}
                    </td>

                    @foreach($row['employee_skills']['skill_level_id'] as $i => $skill)
                        <td align="center" @if($skill['skill_up'] == "1") bgcolor="#F0AE66" @elseif ($skill['skill_up'] == "2") bgcolor="#F6DDC2" @endif >
                            {!! $skill['skill_level'] !!}
                        </td>
                    @endforeach

                    <td align="center" style="width: 3%">
                        {!! $row['required_number'] !!}
                    </td>
                    <td align="center" style="width: 3%">
                        {!! $row['trained_number'] !!}
                    </td>
                    <td style="font-size: 12px; width: 10%">
                        <div class="container">
                            <div class="progress"
                            @if ($row['progress_rate'] > 0)
                            style="
                                width: {{ $row['progress'] }};
                                @if ($row['progress_rate'] < 50) background-color: red;
                                @elseif ($row['progress_rate'] < 100) background-color: orange;
                                @else background-color: green;
                                @endif
                            "
                            @endif
                            >{{ $row['progress'] }}</div>
                        </div>
                    </td>
                </tr>
            @endforeach
        @endforeach
    </tbody>
</table>