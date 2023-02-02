{{-- Loop all Blocks --}}

<div id="lib">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
</div>

<style>
    .carousel{
        width: 100%;
        height: 250px;
        border: 1px solid black
    }


</style>

@foreach ($evidences as $id => $evidence)
<div class="row" id="block_{{ $id }}">
    <div class="d-flex justify-content-end">
        <button type="button" class="btn-close" aria-label="Close" onclick="deleteBlock('{{ $id }}')"></button>
    </div>
</div>

<div class="row" id="block_content_{{ $id }}">
    <div class="col">
        {{-- Before --}}

        <div id="myCarousel_before_{{ $id }}" class="carousel slide" data-interval="false">
            <!-- Wrapper for slides -->
            <div class="carousel-inner">
                @php $isActive = false; @endphp
                @foreach ($evidence['images'] as $key => $image)
                @if (!empty($image['is_before']))
                    <div class="item {{ $isActive == false ? 'active' : ''}}">
                    <img src="{{ $image['img_path'] }}" alt="{{ $image['img_name'] }}" style="width:100%; height: 250px;" onclick="fullScreen('{{ $image['img_path'] }}')">
                    </div>
                    @php $isActive = true; @endphp
                @endif
                @endforeach
            </div>

            <!-- Left and right controls -->
            <a class="left carousel-control" href="#myCarousel_before_{{ $id }}" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control" href="#myCarousel_before_{{ $id }}" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
        <br>
        <div class="row">
            <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-success btn-sm" id="btnUpload">Upload</button>
                <button type="button" class="btn btn-danger btn-sm" id="btnDelete">Delete</button>
            </div>
        </div>
        <br>
        改善前の問題点
        <br>
        <textarea id="txt" style="width: 100%">{{ $evidence['problem_before'] }}</textarea>
    </div>

    <div class="col">
        {{-- After --}}

        <div id="myCarousel_after_{{ $id }}" class="carousel slide" data-interval="false">
            <!-- Wrapper for slides -->
            <div class="carousel-inner">
                @php $isActive = false; @endphp
                @foreach ($evidence['images'] as $key => $image)
                @if (empty($image['is_before']))
                    <div class="item {{ $isActive == false ? 'active' : ''}}">
                    <img src="{{ $image['img_path'] }}" alt="{{ $image['img_name'] }}" style="width:100%; height: 250px;" onclick="fullScreen('{{ $image['img_path'] }}')">
                    </div>
                    @php $isActive = true; @endphp
                @endif
                @endforeach
            </div>

            <!-- Left and right controls -->
            <a class="left carousel-control" href="#myCarousel_after_{{ $id }}" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control" href="#myCarousel_after_{{ $id }}" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
        <br>
        <div class="row">
            <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-success btn-sm" id="btnUpload">Upload</button>
                <button type="button" class="btn btn-danger btn-sm" id="btnDelete">Delete</button>
            </div>
        </div>
        <br>
        改善のポイント
        <br>
        <textarea id="txt" style="width: 100%">{{ $evidence['problem_after'] }}</textarea>
    </div>
</div>
<hr>
@endforeach