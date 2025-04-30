<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NagiosController extends Controller
{
    public function index()
    {
        $response = Http::withBasicAuth(
            env('NAGIOS_USER'),
            env('NAGIOS_PASS')
        )->get(env('NAGIOS_STATUS_URL'), [
            'query' => 'hostlist',
        ]);

        $hostlist = $response->json()['data']['hostlist'] ?? [];

        return \Inertia\Inertia::render('Nagios/HostList', [
            'hosts' => $hostlist,
        ]);
    }

    public function getHostList()
    {
        $response = Http::withBasicAuth(
            env('NAGIOS_USER'),
            env('NAGIOS_PASS')
        )->get(env('NAGIOS_STATUS_URL'), [
            'query' => 'hostlist',
        ]);

        $hostlist = $response->json()['data']['hostlist'] ?? [];

        return \Inertia\Inertia::render('Nagios/HostList', [
            'hosts' => $hostlist,
        ]);
    }


    public function disableHostCheck(Request $request)
    {
        $host = $request->input('host');

        $response = Http::withBasicAuth(
            env('NAGIOS_USER'),
            env('NAGIOS_PASS')
        )->asForm()->post(env('NAGIOS_URL'), [
            'cmd_typ' => 7, // DISABLE_HOST_CHECK
            'host' => $host,
            'btnSubmit' => 'Commit',
        ]);

        return response()->json([
            'status' => 'ok',
            'message' => "Host check disabled for $host",
            'nagios_response_code' => $response->status()
        ]);
    }

    public function enableHostCheck(Request $request)
    {
        $host = $request->input('host');

        $response = Http::withBasicAuth(
            env('NAGIOS_USER'),
            env('NAGIOS_PASS')
        )->asForm()->post(env('NAGIOS_URL'), [
            'cmd_typ' => 8, // ENABLE_HOST_CHECK
            'host' => $host,
            'btnSubmit' => 'Commit',
        ]);

        return response()->json([
            'status' => 'ok',
            'message' => "Host check enabled for $host",
            'nagios_response_code' => $response->status()
        ]);
    }

    public function scheduleDowntime(Request $request)
    {
        $host = $request->input('host');
        $start = time();
        $end = $start + 3600; // на час

        $response = Http::withBasicAuth(
            env('NAGIOS_USER'),
            env('NAGIOS_PASS')
        )->asForm()->post(env('NAGIOS_URL'), [
            'cmd_typ' => 55, // SCHEDULE_HOST_DOWNTIME
            'host' => $host,
            'com_data' => 'Scheduled from Laravel API',
            'start_time' => date('m-d-Y H:i:s', $start),
            'end_time' => date('m-d-Y H:i:s', $end),
            'btnSubmit' => 'Commit',
        ]);

        return response()->json([
            'status' => 'ok',
            'message' => "Downtime scheduled for $host",
            'nagios_response_code' => $response->status()
        ]);
    }
}

