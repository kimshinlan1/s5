<?php

$index = $currentTotalRows;
$areas = [];
$locations = [];

?>

@foreach ($data as $key => $row)

<?php $locaitonIdToCheck = $row['area_id'] . $row['location_id'] ?>

@if (!in_array($row['area_id'], $areas))
<tr id="area_{{ $row['area_id'] }}_location_{{ $row['location_id'] }}_row_{{ $index }}" class="main_area">
@elseif (!in_array($locaitonIdToCheck, $locations))
<tr id="area_{{ $row['area_id'] }}_location_{{ $row['location_id'] }}_row_{{ $index }}" class="main_location">
@else
<tr id="area_{{ $row['area_id'] }}_location_{{ $row['location_id'] }}_row_{{ $index }}" class="">
@endif

    {{-- Area --}}
    @if (!in_array($row['area_id'], $areas))
    <td rowspan="{{ $count5sChecked * $row['count_locations'] }}" class="area">
        <input type="text" class="form-control" id="area" value="{{ $row['area_name'] }}"/>
        <a href="javascript:addLocation( '{{ $row['area_id'] }}', '{{ $row['location_id'] }}', {{ $index }}, {{ $row['count_locations'] }} )" id="">Add Location</a>
    </td>
    <?php $areas[] = $row['area_id'] ?>

    {{-- Hidden --}}
    <input type="hidden" id="hidAreaId" value="{{ $row['area_id'] }}"/>

    @endif

    {{-- Locations --}}
    @if (!in_array($locaitonIdToCheck, $locations))
    <td rowspan="{{ $count5sChecked }}" onclick="selectLocationToDelete(this, '{{ $row['area_id'] }}', '{{ $row['location_id'] }}')" class="location">
        <input type="text" class="form-control" id="location" value="{{ $row['location_name'] }}"/>
    </td>
    <?php $locations[] = $locaitonIdToCheck ?>

    {{-- Hidden --}}
    <input type="hidden" id="hidLocationId" value="{{ $row['location_id'] }}"/>
    @endif

    {{-- Point --}}
    <td>
        {{ $row['5s'] }}
        <input type="hidden" id="hid5S" value="{{ $row['5s'] }}"/>
        <input type="hidden" id="hidCountLocation" value="{{ $row['count_locations'] }}"/>
        <input type="hidden" id="hidCountLocationDelete" value="0"/>
    </td>

    {{-- Levels --}}
    <td><textarea class="form-control" id="level_1" rows="1">{{ $row['level_1'] }}</textarea></td>
    <td><textarea class="form-control" id="level_2" rows="1">{{ $row['level_2'] }}</textarea></td>
    <td><textarea class="form-control" id="level_3" rows="1">{{ $row['level_3'] }}</textarea></td>
    <td><textarea class="form-control" id="level_4" rows="1">{{ $row['level_4'] }}</textarea></td>
    <td><textarea class="form-control" id="level_5" rows="1">{{ $row['level_5'] }}</textarea></td>

    <?php $index++ ?>

</tr>
@endforeach
