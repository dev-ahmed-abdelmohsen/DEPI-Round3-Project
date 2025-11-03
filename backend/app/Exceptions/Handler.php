<?php

namespace App\Exceptions;

use App\Traits\Response;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    use Response;
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        // Handle model not found
        if ($exception instanceof ModelNotFoundException) {
            return $this->error('Resource not found', 404);
        }

        // Handle HTTP not found
        if ($exception instanceof NotFoundHttpException) {
            return $this->error('Endpoint not found', 404);
        }

        // Handle validation errors
        if ($exception instanceof \Illuminate\Validation\ValidationException) {
            return $this->error($exception->errors(), 422);
        }

        // Fallback for other exceptions
//        return $this->error($exception->getMessage(), 500, $exception->getTraceAsString());
        return $this->error($exception->getMessage(), 500);
        //used for debugging, remove in production, better handling of exceptions
    }

}
