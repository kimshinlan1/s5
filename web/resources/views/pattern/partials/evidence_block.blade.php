{{-- Loop all Blocks --}}

{{-- Call lib when show evidence dialog --}}
<div id="lib">
    <link rel="stylesheet" href= "{!! url('assets/bootstrap-3.4.1/css/bootstrap.min.css') !!}"/>
    <link href="{{ mix('/css/evidence.css') }}" rel="stylesheet"/>
    <script src="{!! url('assets/bootstrap-3.4.1/js/bootstrap.min.js') !!}" type="text/javascript"></script>
</div>

@foreach ($evidences as $id => $evidence)
<input type="hidden" id="hidInspectionId_{{ $evidence['id'] }}" value="{{ $evidence['id'] }}"/>
{{-- Cross Button --}}
<div class="row" id="block_{{ $evidence['id'] }}">
    <div class="d-flex justify-content-end">
        {{-- <button type="button" class="btn-close" aria-label="Close" onclick="deleteBlock('{{ $evidence['id'] }}')"></button> --}}
        <input type="checkbox" data-id="{{ $evidence['id'] }}" class="remove-blocks" style="margin-right: 1.7rem; transform: scale(2);">
    </div>
</div>

<div class="row count-block" id="block_content_{{ $evidence['id'] }}" data-id="{{ $evidence['id'] }}">
    <div class="col-5" style="padding-left: 3rem;">
        {{-- Before --}}
        <input type="hidden" id="beforeUploadedIndex" value="0"/>
        <div class="before-title">
            <label class="before-label py-2">{{ __('Evidence_Before_Title') }}</label>
        </div>
        <div id="myCarousel_before_{{ $evidence['id'] }}" class="carousel slide" data-interval="false">
            <!-- Wrapper for slides -->
            <div class="carousel-inner" id="img_before{{ $evidence['id'] }}">
                @if (!$evidence['hasBefore'])
                    <img class="img-size" src="{{ Constant::NO_IMAGE_PATH }}" alt="no-image" style="width:100%;" onclick="" id="noImg">
                @else
                    @php $isActive = false; @endphp
                    @foreach ($evidence['images'] as $key => $image)
                        @if (!empty($image['is_before']))
                            <div class="item {{ $isActive == false ? 'active' : ''}} item-count" id="item{{ $image['id'] }}" data-id="{{ $image['id'] }}">
                                <button type="submit" title="{{ __('Evidence_Delete_Image_Tooltip') }}" class="close-image" id='removeImage{{ $image['id'] }}' onclick="removeImage({{ $image['id'] }}, 'img_before{{ $evidence['id'] }}')">
                                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                                </button>
                                <img class="img-size" src="{{ $image['img_path'] }}" alt="{{ $image['img_name'] }}" style="width:100%; position: relative; object-fit: contain;" onclick="fullScreen('{{ $image['img_path'] }}')">
                            </div>
                            @php $isActive = true; @endphp
                        @endif
                    @endforeach
                @endif
            </div>

            <!-- Left and right controls -->
            <a class="left carousel-control" href="#myCarousel_before_{{ $evidence['id'] }}" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control right-control" href="#myCarousel_before_{{ $evidence['id'] }}" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
        <br>
        <div class="row">
            <div class="d-flex justify-content-center">
                <div class="file-div btn btn-primary btn-sm mx-1" id="btnUpload">{{ __('Evidence_Upload_Btn') }}<input type="file" class="file file-before" name="file" onchange="uploadFile(this, {{ $evidence['id'] }}, 1, 'img_before{{ $evidence['id'] }}')" accept="image/*" multiple/></div>
                <button type="button" title="{{ __('Evidence_Delete_Album_Tooltip') }}" class="btn btn-danger btn-sm mx-1" id="btnDelete" onclick="removeAlbum('img_before{{ $evidence['id'] }}', {{ $evidence['id'] }}, 1)">{{ __('Evidence_Delete_Btn') }}</button>
            </div>
        </div>
        <br>
        <div class="row" style="padding-left: 1rem;">
            <div class="col-4">
                <input type="text" class="form-control" id="dateCreateBefore{{ $evidence['id'] }}" placeholder="日付"
                data-date-format="YYYY-MM-DD" onclick="triggerCalendar('dateCreateBefore{{ $evidence['id'] }}')" data-toggle="tooltip"
                title="{{ __('Common_Click_To_Select_Date') }}" value="{{  isset($evidence['date_before']) ? date('Y年m月d日', strtotime($evidence['date_before'])) : ''}}">
            </div>
            <div class="col-8">
                <input type="text" style="width: 98%;" id="locationBefore{{ $evidence['id'] }}" class="form-control" placeholder="場所" value="{{ $evidence['location_before'] }}">
            </div>
        </div>
        <br>
        <span class="fw-bold" style="font-size: 1.7rem; color:#aa403b">
            {{ __('Evidence_Before_Problem') }}
        </span>
        <textarea id="problemBefore{{ $evidence['id'] }}" class="problem-area">{{ $evidence['problem_before'] }}</textarea>
    </div>
    <div class="col-2" style="text-align: center;">
        <div class="row" style="height: 50px"></div>
        <div class="row" style="height:350px; display: flex; justify-content: center; align-items: center;">
            <i class="fa fa-caret-right right-arrow" aria-hidden="true"></i>
        </div>
    </div>
    <div class="col-5" style="padding-right: 3rem;">
        {{-- After --}}
        <input type="hidden" id="afterUploadedIndex" value="0"/>
        <div class="after-title">
            <label class="after-label py-2">{{ __('Evidence_After_Title') }}</label>
        </div>
        <div id="myCarousel_after_{{ $evidence['id'] }}" class="carousel slide" data-interval="false">
            <!-- Wrapper for slides -->
            <div class="carousel-inner" id="img_after{{ $evidence['id'] }}">
                @if (!$evidence['hasAfter'])
                    <img class="img-size" src="{{ Constant::NO_IMAGE_PATH }}" alt="no-image" style="width:100%;" onclick="" id="noImg">
                @else
                    @php $isActive = false; @endphp
                    @foreach ($evidence['images'] as $key => $image)
                        @if (empty($image['is_before']))
                            <div class="item {{ $isActive == false ? 'active' : ''}} item-count" id="item{{ $image['id'] }}" data-id="{{ $image['id'] }}">
                                <button type="submit" title="{{ __('Evidence_Delete_Image_Tooltip') }}" class="close-image" id='removeImage{{ $image['id'] }}' onclick="removeImage({{ $image['id'] }}, 'img_after{{ $evidence['id'] }}')">
                                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                                </button>
                                <img class="img-size" src="{{ $image['img_path'] }}" alt="{{ $image['img_name'] }}" style="width:100%; position: relative; object-fit: contain;" onclick="fullScreen('{{ $image['img_path'] }}')">
                            </div>
                            @php $isActive = true; @endphp
                        @endif
                    @endforeach
                @endif
            </div>

            <!-- Left and right controls -->
            <a class="left carousel-control" href="#myCarousel_after_{{ $evidence['id'] }}" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control right-control" href="#myCarousel_after_{{ $evidence['id'] }}" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
        <br>
        <div class="row">
            <div class="d-flex justify-content-center">
                <div class="file-div btn btn-primary btn-sm mx-1" id="btnUpload">{{ __('Evidence_Upload_Btn') }} <input type="file" class="file file-after" name="file" onchange="uploadFile(this, {{ $evidence['id'] }}, 0, 'img_after{{ $evidence['id'] }}')" accept="image/*" multiple/></div>
                <button type="button" title="{{ __('Evidence_Delete_Album_Tooltip') }}" class="btn btn-danger btn-sm mx-1" id="btnDelete" onclick="removeAlbum('img_after{{ $evidence['id'] }}', {{ $evidence['id'] }}, 0)">{{ __('Evidence_Delete_Btn') }}</button>
            </div>
        </div>
        <br>
        <div class="row" style="padding-left: 1rem;">
            <div class="col-4">
                <input type="text" style="" class="form-control" id="dateCreateAfter{{ $evidence['id'] }}" placeholder="日付"
                data-date-format="YYYY-MM-DD" onclick="triggerCalendar('dateCreateAfter{{ $evidence['id'] }}')" data-toggle="tooltip"
                title="{{ __('Common_Click_To_Select_Date') }}" value="{{  isset($evidence['date_after']) ? date('Y年m月d日', strtotime($evidence['date_after'])) : ''}}">
            </div>
            <div class="col-8">
                <input type="text" style="width: 98%;" id="locationAfter{{ $evidence['id'] }}" class="form-control" placeholder="場所" value="{{ $evidence['location_after'] }}">
            </div>
        </div>
        <br>
        <span class="fw-bold" style="font-size: 1.7rem; color:rgb(231, 168, 51)">
            {{ __('Evidence_After_Problem') }}
        </span>
        <textarea id="problemAfter{{ $evidence['id'] }}" class="problem-area">{{ $evidence['problem_after'] }}</textarea>
    </div>
    <hr>
</div>
@endforeach