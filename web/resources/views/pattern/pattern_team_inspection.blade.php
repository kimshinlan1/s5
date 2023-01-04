@extends('layouts.app')

@push('css')
    <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="Stylesheet"
        type="text/css"/>
    {{-- <link href="{{ mix('/css/pattern.css') }}" rel="stylesheet"/> --}}
@endpush

@push('scripts')
    <script src="{!! url('assets/jquery/jquery-3.2.1.slim.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-1.6.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery-ui.min.js') !!}" type="text/javascript"></script>
    <script src="{!! url('assets/jquery/jquery.ui.datepicker-ja.min.js') !!}" type="text/javascript"></script>
    <script src="{{ mix('/js/pattern_team_inspection.js') }}"></script>
@endpush

@section('sidebar')
    @include('layouts.manage_sidebar')
@endsection

@section('content')

<style>
    body {
        overflow-x: unset;
    }

</style>

    <div class="h-title">5S入力画面</div>

    <div class="d-flex justify-content-start mb-4">
        Team Name
    </div>

    @php
        $width_data = "50px";

        $areas = [];
        $locations = [];

    @endphp

    <div style="width: 100%; height: auto; overflow: auto; ">

        <table id="" class="table table-bordered" style="width: fit-content;">

            {{-- Radar Chart --}}
            <tr>
                <td colspan="3">
                    ここにイラスト
                </td>
                @for ($i = 0; $i < $countColumn; $i++)
                <td style="width: {{ $width_data }}">
                    Radar Chart
                </td>
                @endfor
            </tr>

            {{-- Bar Chart --}}
            <tr>
                <td colspan="3">
                    ここにイラスト
                </td>
                <td colspan="{{ $countColumn }}">
                    Bar Chart
                </td>
            </tr>

            {{-- 改善結果を見る --}}
            <tr>
                <td colspan="3">

                </td>
                @for ($i = 0; $i < $countColumn; $i++)
                <td>
                    <input type="button" value="改善結果を見る"/>
                    <br>
                    <a href="">10件登録済</a>
                    <br>
                    <a href="">新しく登録する</a>
                </td>
                @endfor
            </tr>

            {{-- 平均 --}}
            <tr>
                <td rowspan="5" style="width: 20px">平均</td>
                <td style="width: 50px">整理</td>
                <td style="width: 50px">1S</td>
                @for ($i = 0; $i < $countColumn; $i++)
                <td>
                    Point avg
                </td>
                @endfor
            </tr>
            <tr>
                <td>整頓</td>
                <td>2S</td>
                @for ($i = 0; $i < $countColumn; $i++)
                <td>
                    Point avg
                </td>
                @endfor
            </tr>
            <tr>
                <td>清掃</td>
                <td>3S</td>
                @for ($i = 0; $i < $countColumn; $i++)
                <td>
                    Point avg
                </td>
                @endfor
            </tr>
            <tr>
                <td>清潔</td>
                <td>4S</td>
                @for ($i = 0; $i < $countColumn; $i++)
                <td>
                    Point avg
                </td>
                @endfor
            </tr>
            <tr>
                <td>躾</td>
                <td>5S</td>
                @for ($i = 0; $i < $countColumn; $i++)
                <td>
                    Point avg
                </td>
                @endfor
            </tr>

            {{-- 点検実施日 --}}
            <tr>
                <td rowspan="2">No</td>
                <td rowspan="2">点検箇所</td>
                <td rowspan="2">ポイント</td>
                @for ($i = 0; $i < $countColumn; $i++)
                <td>
                    点検実施日
                </td>
                @endfor
            </tr>
            <tr>
                @for ($i = 0; $i < $countColumn; $i++)
                <td>
                    <input type="text" placeholder="年月日" style="width: 100px"/>
                </td>
                @endfor
            </tr>

            {{-- Pattern List --}}
            @foreach ($data as $key => $row)

                <?php $locaitonIdToCheck = $row['area_id'] . $row['location_id'] ?>

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
                    <td>
                        {{ Constant::NAME_5S[$row['5s']] }}
                    </td>

                    @for ($i = 0; $i < $countColumn; $i++)
                    <td>
                        <select class="form-select">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </td>
                    @endfor

                </tr>
            @endforeach


        </table>

    </div>

    <br>

    <button type="button" class="btn btn-success" id="btnSave">保存</button>

    <button type="button" class="btn btn-primary" id="btnAdd">点検箇所の追加</button>


@endsection
