<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LabelController;
use App\Http\Controllers\Api\ShapeController;
use App\Http\Controllers\Api\TodoController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('todos', TodoController::class);
    Route::put('/todos/{todo}/labels', [TodoController::class, 'syncLabels']);
    Route::apiResource('labels', LabelController::class);

    // ElectricSQL shape proxy
    Route::get('/shape/todos', [ShapeController::class, 'todos']);
    Route::get('/shape/labels', [ShapeController::class, 'labels']);
    Route::get('/shape/todo-labels', [ShapeController::class, 'todoLabels']);
});

