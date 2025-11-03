<?php

namespace App\Traits;
use Illuminate\Http\JsonResponse;

trait Response
{
    /**
     * Return a success response.
     *
     * @param mixed $data
     * @param string $message
     * @return JsonResponse
     */
    public function success($data = null, string $message = 'Success', $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    /**
     * Return an error response.
     *
     * @param string $message
     * @param int $code
     * @return JsonResponse
     */
    public function error($message = 'Error', $code = 400, $data = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => $data,
        ], $code);
    }
}
