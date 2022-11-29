<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title> {{ $titleFileName }}_pdf</title>
    <style type="text/css">
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

        .title-chart {
            /* position: absolute; */
            margin-bottom: 10rem;
            margin-left: 0.5rem;
            /* text-decoration: underline; */
            font-weight: bolder;
            border-bottom:1px solid black;
            padding-bottom:1px;
        }

        .title {
            font-size: 25px;
            color: rgb(11, 123, 123);
            text-decoration: underline;
            margin-top: 8px;
        }

        .name-employee {
            color: black;
            margin-top: -15px;
            margin-left: 105px;
            font-size: 31px;
        }

        img {
            display: block;
            page-break-inside: avoid;
        }

        body {
            font-family: 'yugothib';
        }
        .date-from-to {
            width: 20%;
            text-indent: 20px;
            font-weight: lightest;
            color: gray;
            font-size: 12px;
        }
    </style>
</head>

