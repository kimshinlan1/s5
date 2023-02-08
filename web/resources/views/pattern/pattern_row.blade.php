<?php

$index = $currentTotalRows;
$areas = [];
$locations = [];

?>

@foreach ($data as $key => $row)

<?php $locaitonIdToCheck = $row['area_id'] . $row['location_id'] ?>

@if (!in_array($row['area_id'], $areas))
<tr id="area_{{ $row['area_id'] }}_location_{{ $row['location_id'] }}_row_{{ $index }}" class="main_area main_location">
@elseif (!in_array($locaitonIdToCheck, $locations))
<tr id="area_{{ $row['area_id'] }}_location_{{ $row['location_id'] }}_row_{{ $index }}" class="main_location">
@else
<tr id="area_{{ $row['area_id'] }}_location_{{ $row['location_id'] }}_row_{{ $index }}" class="">
@endif

    {{-- Area --}}
    @if (!in_array($row['area_id'], $areas))
    <td rowspan="{{ $row['area_rowspan'] }}" class="area">
        <input type="text" class="form-control" id="area" value="{{ $row['area_name'] }}"/>
        <a href="javascript:void(0)" onclick="addLocation( '{{ $row['area_id'] }}', '{{ $row['location_id'] }}', {{ $index }} )">点検箇所を追加</a>
    </td>
    <?php $areas[] = $row['area_id'] ?>

    {{-- Hidden --}}
    <input type="hidden" id="hidAreaId" value="{{ $row['area_id'] }}"/>

    @endif

    {{-- Locations --}}
    @if (!in_array($locaitonIdToCheck, $locations))
    <td rowspan="{{ $row['location_rowspan'] }}" onclick="selectLocationToDelete(this, '{{ $row['area_id'] }}', '{{ $row['location_id'] }}')" class="location">
        <input type="text" class="form-control" id="location" value="{{ $row['location_name'] }}" onchange="updateLocationName(this, '{{ $row['area_id'] }}', '{{ $row['location_id'] }}')"/>
    </td>
    <?php $locations[] = $locaitonIdToCheck ?>

    {{-- Hidden --}}
    <input type="hidden" id="hidLocationId" value="{{ $row['location_id'] }}"/>
    @endif

    {{-- Point --}}
    <td class="td_point" onclick="selectMethodToDelete(this, '{{ $row['area_id'] }}', '{{ $row['location_id'] }}', '{{ $index }}')">
        {{ Constant::NAME_5S[$row['5s']] }}
        <input type="hidden" id="hid5S" value="{{ $row['5s'] }}"/>
        <input type="hidden" id="hidCountLocation" value="{{ $row['count_locations'] }}"/>
        <input type="hidden" id="hidCountLocationDelete" value="0"/>

        <input type="hidden" id="hidAreaRowspan" value="{{ $row['area_rowspan'] }}"/>
        <input type="hidden" id="hidLocationRowspan" value="{{ $row['location_rowspan'] }}"/>

        {{-- <input type="hidden" id="hidAreaId" value="{{ $row['area_id'] }}"/> --}}
        <input type="hidden" id="hidAreaName" value="{{ $row['area_name'] }}"/>
        <input type="hidden" id="hidLocationName" value="{{ $row['location_name'] }}"/>
    </td>

    {{-- Levels --}}
    <td><textarea class="form-control t-area" oninput="auto_grow(this)" id="level_1" rows="1">{{ $row['level_1'] }}</textarea></td>
    <td><textarea class="form-control t-area" oninput="auto_grow(this)" id="level_2" rows="1">{{ $row['level_2'] }}</textarea></td>
    <td><textarea class="form-control t-area" oninput="auto_grow(this)" id="level_3" rows="1">{{ $row['level_3'] }}</textarea></td>
    <td><textarea class="form-control t-area" oninput="auto_grow(this)" id="level_4" rows="1">{{ $row['level_4'] }}</textarea></td>
    <td><textarea class="form-control t-area" oninput="auto_grow(this)" id="level_5" rows="1">{{ $row['level_5'] }}</textarea></td>

    <?php $index++ ?>

</tr>
@endforeach

<input type="hidden" id="hidTotalRows" value="{{ count($data) }}" />

<script>
    $("textarea").each(function () {
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
    });
</script>