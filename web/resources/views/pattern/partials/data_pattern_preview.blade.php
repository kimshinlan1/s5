<?php

$index = 0;
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
    <td rowspan="{{ $row['area_rowspan'] }}" class="area" style="background-color: #d8e4bc; ">
        {{ $row['area_name'] }}
    </td>
    <?php $areas[] = $row['area_id'] ?>
    @endif

    {{-- Locations --}}
    @if (!in_array($locaitonIdToCheck, $locations))
    <td rowspan="{{ $row['location_rowspan'] }}" class="location" style="background-color: #d8e4bc; ">
        {{ $row['location_name'] }}
    </td>
    <?php $locations[] = $locaitonIdToCheck ?>
    @endif

    {{-- Point --}}
    <td>
        {{ Constant::NAME_5S[$row['5s']] }}
    </td>

    {{-- Levels --}}
    <td>{{ $row['level_1'] }}</td>
    <td>{{ $row['level_2'] }}</td>
    <td>{{ $row['level_3'] }}</td>
    <td>{{ $row['level_4'] }}</td>
    <td>{{ $row['level_5'] }}</td>

    <?php $index++ ?>

</tr>
@endforeach
