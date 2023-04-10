<div class="header">
    <nav class="navbar navbar-expand-md navbar-light px-4" id="navbar">
        <a class="navbar-brand" style="margin-right: 1rem;" id="side-bar-menu">
            <svg style="fill: white; margin-right: 0.25rem!important;" version="1.1" id="icon-menu" xmlns="http://www.w3.org/1999/xlink" x="0" y="0"
                width="37" height="37" viewBox="0 0 37 37" style="enable-background:new 0 0 37 37;" space="preserve">
                <path class="_2y-e" d="M8,26h21v-1.8H8V26z M8,11v1.8h21V11H8z
                M8,19.2h21v-1.8H8V19.2z"></path>
            </svg>
        </a>
        <a class="navbar-brand navbar-brand d-sm-flex align-items-center align-self-stretch" href="{{ url('/') }}">
            <span class="site-logo h-100"></span>
        </a>
        <a class="navbar-brand" href="{{ url('/') }}" style="padding-left: 0.4rem;">
            {{ __('Techmap_System') }}
        </a>
        <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown">
                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false" v-pre>
                    {{ auth()->user()->name }}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                        class="bi bi-gear-fill" viewBox="0 0 16 16">
                        <path
                            d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                    </svg>
                </a>

                <div class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item @if(request()->path()==='user')active @endif" href="/my_page/{{auth()->user()->id}}">
                        {{ __('My_Page') }}
                    </a>
                    <a id="logoutBtn" class="dropdown-item logout" href="{{ route('logout') }}"
                        onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                        {{ __('Logout') }}
                    </a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                        @csrf
                    </form>
                </div>
            </li>
        </ul>
    </nav>
</div>
