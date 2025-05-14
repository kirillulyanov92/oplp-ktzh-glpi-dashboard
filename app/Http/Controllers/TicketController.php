<?php

namespace App\Http\Controllers;

use App\Services\GLPIService;
use Inertia\Inertia;

class TicketController extends Controller
{
    protected GLPIService $glpiService;

    public function __construct(GLPIService $glpiService)
    {
        $this->glpiService = $glpiService;
    }

    public function index()
    {
        try {
            // Фильтры для поиска тикетов
            $criteria = [
                [
                    'field' => 8,
                    'searchtype' => 'equals',
                    'value' => 'mygroups',
                    'link' => 'AND'
                ],
                [
                    'link' => 'AND',
                    'criteria' => [
                        [
                            'field' => 12,
                            'searchtype' => 'equals',
                            'value' => '1',
                            'link' => 'AND'
                        ],
                        [
                            'field' => 12,
                            'searchtype' => 'equals',
                            'value' => 'process',
                            'link' => 'OR'
                        ]
                    ]
                ]
            ];

            // Получаем тикеты с фильтрами
            $tickets = $this->glpiService->searchTickets($criteria);

            // dd($tickets);
            
            // Отображаем результаты на странице
            return Inertia::render('Tickets/Index', [
                'tickets' => $tickets['data'] ?? [],
            ]);
        } catch (\Exception $e) {
            // Обработка ошибки
            return Inertia::render('Error', [
                'message' => 'Ошибка при получении заявок: ' . $e->getMessage(),
            ]);
        }
    }

    public function fetch()
    {
        try {
            $criteria = [
                [
                    'field' => 8,
                    'searchtype' => 'equals',
                    'value' => 'mygroups',
                    'link' => 'AND'
                ],
                [
                    'link' => 'AND',
                    'criteria' => [
                        [
                            'field' => 12,
                            'searchtype' => 'equals',
                            'value' => '1',
                            'link' => 'AND'
                        ],
                        [
                            'field' => 12,
                            'searchtype' => 'equals',
                            'value' => 'process',
                            'link' => 'OR'
                        ]
                    ]
                ]
            ];

            $tickets = $this->glpiService->searchTickets($criteria);

            return response()->json([
                'tickets' => $tickets['data'] ?? [],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'tickets' => [],
                'error' => 'Ошибка при получении тикетов',
            ], 500);
        }
    }


}
