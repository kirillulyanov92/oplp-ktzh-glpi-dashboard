<?php

namespace App\Http\Controllers;

use App\Services\GLPIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class GLPIController extends Controller
{
    protected $glpiService;

    public function __construct(GLPIService $glpiService)
    {
        $this->glpiService = $glpiService;
    }

    public function getTickets()
    {
        $tickets = Cache::remember('glpi_tickets', 300, function () {
            return $this->glpiService->getTickets();
        });

        return response()->json($tickets);
    }
}
