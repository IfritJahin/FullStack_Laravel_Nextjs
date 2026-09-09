<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Resources\TaskResource;
use App\Models\Task;

class TaskController extends Controller
{
    public function index(){
        // return response()->json(Task::all(), 200);
        return TaskResource::collection(Task::all());
    }
    public function store(Request $request){
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,completed',
        ]);
        $task = Task::create($data);
        return response()->json($task, 201);
    }
    public function show(Task $task){
        // return response()->json($task);
        return new TaskResource($task);
    }
    public function update(Request $request, Task $task){
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,completed',
        ]);
        $task -> update($data);
        return response()->json($task);

    }
    public function destroy(Task $task){
        $task->delete();
        return response()->json(['message' => 'Task deleted sucessfully']);
    }
}
