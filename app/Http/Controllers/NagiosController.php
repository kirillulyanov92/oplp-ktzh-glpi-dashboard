<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NagiosController extends Controller
{
    public function index()
    {
        $hostlist = $this->fetchNagiosHostList();
        
        return \Inertia\Inertia::render('Nagios/HostList', [
            'hosts' => $hostlist,
        ]);
    }

    
    public function disableHostCheck(Request $request)
    {
        $host = $request->input('host');
        
        $response = $this->executeNagiosCommand(7, [
            'host' => $host,
            'btnSubmit' => 'Commit',
        ]);
        
        return response()->json([
            'status' => 'ok',
            'message' => "Host check disabled for $host",
            'nagios_response_code' => $response->status()
        ]);
    }

    /**
     * Базовый метод для создания аутентифицированного запроса к Nagios
     * 
     * @return \Illuminate\Http\Client\PendingRequest
     */
    private function createNagiosRequest()
    {
        return Http::withBasicAuth(
            env('NAGIOS_USER'),
            env('NAGIOS_PASS')
        );
    }
    
    /**
     * Получить список хостов из API Nagios
     * 
     * @return array
     */
    private function fetchNagiosHostList()
    {
        $response = $this->createNagiosRequest()
            ->get(env('NAGIOS_STATUS_URL'), [
                'query' => 'hostlist',
            ]);

        return $response->json()['data']['hostlist'] ?? [];
    }
    
    /**
     * Выполнить команду в Nagios
     * 
     * @param int $commandType Тип команды Nagios (например, 7 для DISABLE_HOST_CHECK)
     * @param array $params Дополнительные параметры команды
     * @return \Illuminate\Http\Client\Response
     */
    private function executeNagiosCommand(int $commandType, array $params = [])
    {
        return $this->createNagiosRequest()
            ->asForm()
            ->post(env('NAGIOS_URL'), array_merge(
                ['cmd_typ' => $commandType],
                $params
            ));
    }
}


