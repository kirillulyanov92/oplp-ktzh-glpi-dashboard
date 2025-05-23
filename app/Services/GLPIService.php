<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GLPIService
{
    protected string $apiUrl;
    protected string $appToken;
    protected string $userToken;
    protected ?string $sessionToken = null;
    protected ?string $appProxy = null;
    // protected string $appProxy;

    

    public function __construct()
    {
        $this->apiUrl = env('GLPI_API_URL');
        $this->appToken = env('GLPI_APP_TOKEN');
        $this->userToken = env('GLPI_USER_TOKEN');
        $this->appProxy = env('GLPI_PROXY');
    }

    /**
     * Универсальный HTTP клиент с прокси и отключенным SSL
     */
    private function http()
    {
        
        return Http::withOptions([
            //'debug' => true,
            'proxy' => $this->appProxy,
            'verify' => false,
        ]);
    }

    private function authHeaders(): array
    {
        return [
            'App-Token' => $this->appToken,
            'Authorization' => 'user_token ' . $this->userToken,
            'Content-Type' => 'application/json',
        ];
    }

    private function sessionHeaders(): array
    {
        return [
            'App-Token' => $this->appToken,
            'Session-Token' => $this->sessionToken,
            'Content-Type' => 'application/json',
        ];
    }


    /**
     * Получает session_token из GLPI API
     */
    private function initSession(): void
    {
        
        $response = $this->http()
            ->withHeaders($this->authHeaders()) // Используем готовый метод
            ->get("{$this->apiUrl}/initSession");

        if ($response->successful()) {
            $this->sessionToken = $response->json('session_token');
        } else {
            throw new \Exception('Ошибка авторизации GLPI: ' . $response->body());
        }
    }


    /**
     * Универсальный GET-запрос с автоматическим восстановлением сессии
     */
    private function makeGetRequest(string $endpoint)
    {
        if (!$this->sessionToken) {
            $this->initSession();
        }

        $response = $this->http()
            ->withHeaders($this->sessionHeaders())
            ->get("{$this->apiUrl}/{$endpoint}");

        if ($response->status() === 401) {
            Log::warning("GLPI session expired, reinitializing...");
            $this->initSession();
            
            $response = $this->http()
                ->withHeaders($this->sessionHeaders())
                ->get("{$this->apiUrl}/{$endpoint}");
        }

        return $response->json();
    }

    /**
     * Получает список тикетов
     */
    public function getTickets()
    {
        return $this->makeGetRequest('Ticket');
    }

    /**
     * Получает список тикетов
     **/

    public function searchTickets(array $criteria = [])
    {
        $this->initSession();

        $query = [
            'criteria' => $criteria,
            'range' => '0-50', // Ограничиваем вывод
            'forcedisplay' => ['1', '2', '4', '8', '12', '15', '16', '21'], // ID, Заголовок, Статус, и т.п.
            'is_deleted' => 0, // Только не удалённые
            'sort' => '15',         // поле сортировки
            'order' => 'DESC',      // направление сортировки
        ];

        $response = $this->http()
            ->withHeaders($this->sessionHeaders())
            ->get("{$this->apiUrl}/search/Ticket", $query);

        if (!$response->successful()) {
            throw new \Exception("Ошибка запроса: " . $response->body());
        }

        return $response->json();
    }

    /**
     * Закрытие тикета в GLPI
     * 
     * @param int $id ID тикета для закрытия
     * @return bool Результат операции
     */
    public function closeTicket(int $id)
    {
        try {
            // Проверяем сессию и инициализируем при необходимости
            if (empty($this->sessionToken)) {
                $this->initSession();
            }
            
            // Отправляем запрос на закрытие тикета
            // $response = Http::withHeaders([
            //     'Content-Type' => 'application/json',
            //     'Session-Token' => $this->sessionToken,
            //     'App-Token' => $this->appToken,
            // ])
            // ->withOptions([
            //     'proxy' => $this->appProxy,
            //     'verify' => false,
            // ])
            // ->put($this->apiUrl . "/Ticket/$id", [
            //     'status' => 6, // Статус "Закрыт" в GLPI
            //     'closedate' => date('Y-m-d H:i:s'),
            // ]);
            $response = $this->http()
            ->withHeaders($this->sessionHeaders())
            ->put("{$this->apiUrl}/Ticket/$id", [
                'input' => [
                    'status' => 6,
                    'closedate' => date('Y-m-d H:i:s'),
                    'solution' => 'Заявка закрыта через API приложения', // Текст решения
                ]
            ]);
        
        
        

            if ($response->successful()) {
                return true;
            } else {
                Log::error('Failed to close GLPI ticket', [
                    'ticket_id' => $id,
                    'response' => $response->body(),
                    'status' => $response->status(),
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('GLPI close ticket error', [
                'ticket_id' => $id, 
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }


}
