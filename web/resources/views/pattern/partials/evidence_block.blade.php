{{-- Loop all Blocks --}}

{{-- Call lib when show evidence dialog --}}
<div id="lib">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <link href="{{ mix('/css/evidence.css') }}" rel="stylesheet"/>
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
<input type="hidden" id="hidInspectionId_{{ $evidence['id'] }}" value="{{ $evidence['id'] }}"/>
{{-- Cross Button --}}
<div class="row" id="block_{{ $id }}">
    <div class="d-flex justify-content-end">
        <button type="button" class="btn-close" aria-label="Close" onclick="deleteBlock('{{ $id }}')"></button>
    </div>
</div>

<div class="row" id="block_content_{{ $id }}">
    <div class="col-5" style="padding-left: 3rem;">
        {{-- Before --}}
        <div class="before-title">
            <label class="before-label py-2">{{ __('Evidence_Before_Title') }}</label>
        </div>
        <div id="myCarousel_before_{{ $id }}" class="carousel slide" data-interval="false">
            <!-- Wrapper for slides -->
            <div class="carousel-inner" id="img_before{{ $evidence['id'] }}">
                @php $isActive = false; @endphp
                @foreach ($evidence['images'] as $key => $image)
                @if (!empty($image['is_before']))
                    <div class="item {{ $isActive == false ? 'active' : ''}}" id="item{{ $image['id'] }}" data-id="{{ $image['id'] }}">
                    <button type="submit" class="close-image" id='removeImage{{ $image['id'] }}' onclick="removeImage({{ $image['id'] }})">
                        &times;
                    </button>
                    <img src="{{ $image['img_path'] }}" alt="{{ $image['img_name'] }}" style="width:100%; height: 250px; position: relative" onclick="fullScreen('{{ $image['img_path'] }}')">
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
            <a class="right carousel-control right-control" href="#myCarousel_before_{{ $id }}" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
        <br>
        <div class="row">
            <div class="d-flex justify-content-center">
                <div class="file-div btn btn-success btn-sm mx-2" id="btnUpload">{{ __('Evidence_Upload_Btn') }}<input type="file" class="file" name="file" onchange="uploadFile(this, {{ $evidence['id'] }}, 1)" accept="image/*" multiple/></div>
                <button type="button" class="btn btn-danger btn-sm" id="btnDelete" onclick="removeAlbum('img_before{{ $evidence['id'] }}')">{{ __('Evidence_Delete_Btn') }}</button>
            </div>
        </div>
        <br>
        <span class="fw-bold" style="font-size: 1.7rem; color:#aa403b">
            {{ __('Evidence_Before_Problem') }}
        </span>
        <br>
        <textarea id="txt" class="problem-area">{{ $evidence['problem_before'] }}</textarea>
    </div>
    <div class="col-2" style="text-align: center;">
        <div class="row" style="height: 50px"></div>
        <div class="row" style="height:250px; ">
            <i class="fa fa-caret-right right-arrow" aria-hidden="true"></i>
        </div>
    </div>
    <div class="col-5" style="padding-right: 3rem;">
        {{-- After --}}
        <div class="after-title">
            <label class="after-label py-2">{{ __('Evidence_After_Title') }}</label>
        </div>
        <div id="myCarousel_after_{{ $id }}" class="carousel slide" data-interval="false">
            <!-- Wrapper for slides -->
            <div class="carousel-inner" id="img_after{{ $evidence['id'] }}">
                @php $isActive = false; @endphp
                @foreach ($evidence['images'] as $key => $image)
                @if (empty($image['is_before']))
                    <button type="submit" class="close-image" id='removeImage{{ $image['id'] }}' onclick="removeImage({{ $image['id'] }})">
                        &times;
                    </button>
                    <div class="item {{ $isActive == false ? 'active' : ''}}" id="item{{ $image['id'] }}" data-id="{{ $image['id'] }}">
                    <img src="{{ $image['img_path'] }}" alt="{{ $image['img_name'] }}" style="width:100%; height: 250px; position: relative;" onclick="fullScreen('{{ $image['img_path'] }}')">
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
            <a class="right carousel-control right-control" href="#myCarousel_after_{{ $id }}" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
        <br>
        <div class="row">
            <div class="d-flex justify-content-center">
                <div class="file-div btn btn-success btn-sm mx-2" id="btnUpload">{{ __('Evidence_Upload_Btn') }} <input type="file" class="file" name="file" onchange="uploadFile(this, {{ $evidence['id'] }}, 0)" accept="image/*" multiple/></div>
                <button type="button" class="btn btn-danger btn-sm" id="btnDelete" onclick="removeAlbum('img_after{{ $evidence['id'] }}')">{{ __('Evidence_Delete_Btn') }}</button>
            </div>
        </div>
        <br>
        <span class="fw-bold" style="font-size: 1.7rem; color:rgb(231, 168, 51)">
            {{ __('Evidence_After_Problem') }}
        </span>
        <br>
        <textarea id="txt" class="problem-area">{{ $evidence['problem_after'] }}</textarea>
    </div>
</div>
<hr>
@endforeach