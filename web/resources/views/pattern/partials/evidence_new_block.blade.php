{{-- New Block --}}


<?php
    $id = "new_" . time();
?>

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
                <img src="{{ Constant::NO_IMAGE_PATH }}" alt="no-image" style="width:100%; height: 250px;" onclick="">
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
        <textarea id="txt" style="width: 100%"></textarea>
    </div>

    <div class="col">
        {{-- After --}}

        <div id="myCarousel_after_{{ $id }}" class="carousel slide" data-interval="false">
            <!-- Wrapper for slides -->
            <div class="carousel-inner">
                <img src="{{ Constant::NO_IMAGE_PATH }}" alt="no-image" style="width:100%; height: 250px;" onclick="">
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
        <textarea id="txt" style="width: 100%"></textarea>
    </div>
</div>
<hr>