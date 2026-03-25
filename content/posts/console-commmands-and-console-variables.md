---
title: "Console Commands & Console Variables"
date: "2026-03-24"
summary: "Console Variables (CVars) and Console Commands (CCmds) are one of the many often overlooked gems in Unreal Engine. Let's spread more the word about them!"
tags: ["Code"]
---

# Introduction

A **Console Command** (CCmd) is a string sent to the engine, often typed in by the user at the in-game console, that the engine recognizes and can react to in some way. For example, a console commands can trigger a console/log response, change a variable's internal state, and so on.

A **Console Variable** (CVar) can be used to store state information that can be viewed or changed through the console. The **Console Variables Editor** is a panel that displays information about all the console variables set in the project, and provides a central location to view and modify all the variables. You can even create presets to use the same CVars and values across multiple projects.

---

# Console Commands

## Creating a Console Command

You can create a command in your `.cpp` file that when called will call some other function in your code. There are a few options to choose from depending on your needs for:
- The current world context (e.g., to operate on Actors or Game State);
- The full list of command-line arguments passed to the console command.
  
Based on this, choose between:
- `FAutoConsoleCommandWithWorldAndArgs` -- If you need both command arguments and current world context;
- `FAutoConsoleCommandWithWorld` -- If you need just the current world context;
- `FAutoConsoleCommand` -- If you need just the command arguments (or not even that).

According to which one is chosen, you need to use a different delegate to bind a callback. Below there are examples on how to do so:
### Command Requires Both Current World Context and Arguments List

```cpp
// SomeFile.cpp

namespace MyCCmds
{
    static FAutoConsoleCommandWithWorldAndArgs ConsoleCommandWithWorldAndArgs(
        TEXT("MyProject.MyConsoleCommandWithWorldAndArgs"), // CCmd name
        TEXT("Some help description."), // Help description
        FConsoleCommandWithWorldAndArgsDelegate::CreateLambda( // What to do when CCmds is called
            []
            (const TArray<FString>& Args, UWorld* World)
            {
                // Do something...
            }
        ),
        ECVF_Cheat // EConsoleVariableFlags bitmask that represents the mode this CCmd operates. ECVF_Cheat or ECVF_Default is probably what you'll need, but there are a lot more. Check IConsoleManager.h for more info
    );
}
```

###  Command Requires Just the Current World Context

```cpp
// SomeFile.cpp

namespace MyCCmds
{
    static FAutoConsoleCommandWithWorld ConsoleCommandWithWorld(
        TEXT("MyProject.MyConsoleCommandWithWorld"),
        TEXT("Some help description."),
        FConsoleCommandWithWorldDelegate::CreateWeakLambda(
            this,
            []
            (UWorld* World)
            {
                // Do something...
            }
        ),
        ECVF_Cheat
    );
}
```

### Command Requires Just the Arguments List

```cpp
// SomeFile.cpp

namespace MyCCmds
{
    static void MyCallback(const TArray<FString>& Args)
    {
        // Do something...
    }

    static FAutoConsoleCommand ConsoleCommandWithArguments(
        TEXT("MyProject.MyConsoleCommandWithArguments"),
        TEXT("Some help description."),
        FConsoleCommandWithArgsDelegate::CreateStatic(&MyCallback),
        ECVF_Cheat
    );
}
```

### Command Doesn't Require Neither Current World Context nor Arguments List 

```cpp
// SomeFile.cpp

namespace MyCCmds
{
    static FAutoConsoleCommand ConsoleCommand(
        TEXT("MyProject.MyConsoleCommand"),
        TEXT("Some help description."),
        FConsoleCommandDelegate::CreateStatic(&AMyActor::MyCallback),
        ECVF_Cheat
    );
}

void AMyActor::MyCallback()
{
    // Do something...
}
```

## Calling a Console Command 

While playing the game, you can open the console and type your CCmd. It should autocomplete and also display your help message. Separate you command arguments (if any) with spaces:
```cpp
MyProject.MyConsoleCommandWithWorldAndArgs 69 true "Argument3"
```

You can also execute your CCmds on process startup as launch arguments:
```cpp
.\MyGame.exe -ExecCmds="MyProject.MyConsoleCommandWithWorldAndArgs 69 true 'Argument3', MyProject.MyConsoleCommandWithArguments 77"
```

---

# Console Variables

##  Creating a Console Variable

Console Variables are defined within a `.cpp` file, and usually inside a namespace. They can hold values of the following types: `int32`, `float`, `bool` and `FString` . You can define them using TAutoConsoleVariable or FAutoConsoleVariableRef -- their types will be deduced automatically.

`TAutoConsoleVariable` is the preferred, safer, and feature-complete way to define CVars. Use it when you want the Console Variable to be managed, registered, and owned by the system. It:
- Automatically registers the CVar by name;
- Supports thread safety, callbacks, sinks, and cheat protections;
- Owns its own storage of the variable's value.

`FAutoConsoleVariableRef` can be more performant to access it, since you can access it directly without any additional functions. Keep in mind that going with this approach has far more risks though, so prefer it only if you need this extra bit of performance or if you consciously want to:
- Reference an existing variable (e.g., a local or global variable in your code);
- Bypass certain system features like thread safety, callbacks, and sinks;
- Avoid automatic registration or system management.

```cpp
// SomeFile.cpp

namespace MyCVars
{
    /*
     * TAutoConsoleVariable
     */
    static TAutoConsoleVariable ExampleAutoConsoleVariable(
        TEXT("MyProject.MyExampleAutoConsoleVariable"), // Console Variable name
        1, // Default value
        TEXT("Some help description."), // Help description
        ECVF_Cheat // EConsoleVariableFlags bitmask that represents the mode this CVar operates. ECVF_Cheat or ECVF_Default is probably what you'll need, but there are a lot more. Check IConsoleManager.h for more info
    );
    
    /*
     * FAutoConsoleVariableRef
     */
    static bool bDebugSomething = false;
    static FAutoConsoleVariableRef ExampleAutoConsoleVariableRef(
        TEXT("MyProject.MyExampleAutoConsoleVariableRef"),
        bDebugSomething,
        TEXT("Debug mode toggle.\n")
        TEXT("0 = Disabled\n")
        TEXT("1 = Enabled"),
        ECVF_Cheat
    );
}
```

## Accessing a Console Variable Within Its File Definition

Access `TAutoConsoleVariable` value with:
```cpp
MyCVars::ExampleAutoConsoleVariable.GetValueOnGameThread()
```

Access FAutoConsoleVariableRef value directly with (and also same as above):
```cpp
MyCVars::bDebugSomething
```

## Accessing a Console Variable Outside Its File Definition

If you’d like to access the CVars outside of the file where they were defined, you can do the following:
```cpp
//  AnyOtherFile.cpp 

#include "HAL/IConsoleManager.h"
 
void UseCVar()
{
    static IConsoleVariable* CVar = IConsoleManager::Get().FindConsoleVariable(TEXT("MyProject.MyExampleAutoConsoleVariable"));
    if (CVar != nullptr)
    {
        int32 Value = CVar->GetInt();
        UE_LOG(LogTemp, Warning, TEXT("MyProject.MyExampleAutoConsoleVariable = %d"), Value);
    }
}
```

Having to hardcode the CVar name isn't the best approach, so you can do a trick of declaring the CVar name as an `extern` variable in your `.h` and define it in the `.cpp`. Then you can use the name variable to declare/define the CVar and find it on the Console Manager. Here's an example:

```cpp
// SomeFile.h

#pragma once

namespace MyCVars
{
    MYPROJECT_API extern const TCHAR* const ExampleAutoConsoleVariableName;
}
```

```cpp
//  SomeFile.cpp 

#include "SomeFile.h"

namespace MyCVars
{
    const TCHAR* const ExampleAutoConsoleVariableName = TEXT("MyProject.MyExampleAutoConsoleVariable");
    static TAutoConsoleVariable ExampleAutoConsoleVariable(
        ExampleAutoConsoleVariableName,
        1,
        TEXT("Enables My Feature\n")
        TEXT("0 = Disabled\n")
        TEXT("1 = Enabled"),
        ECVF_Cheat
    );
}
```

Now, in any another `.cpp` file, include the header and access the CVar as such:
```cpp
//  AnyOtherFile.cpp 

#include "SomeFile.h"

void UseCVar()
{
    static IConsoleVariable* CVar = IConsoleManager::Get().FindConsoleVariable(MyCVars::ExampleAutoConsoleVariableName);
    if (CVar != nullptr)
    {
        int32 Value = CVar->GetInt();
        UE_LOG(LogTemp, Warning, TEXT("%s = %d"), MyCVars::ExampleAutoConsoleVariableName, Value);
    }
}
```

Blueprints can access the CVars values with the following functions:
// TODO

##  Modifying a Console Variable Value

Like CCmds, you can set your CVars by opening the console, typing the respective name and new value:
```shell
MyProject.MyExampleAutoConsoleVariable 42
```

You can also override your CVars default values by adding them your `DefaultEngine.ini` file:

```cpp
[ConsoleVariables]
MyProject.MyExampleAutoConsoleVariable=42
```

## Listening to Console Variable Value Changes 

You can listen to your CVar changes by subscribing to their delegate.

In case you're in the file where your CVar has been created:
```cpp
// SomeFile.cpp

void AMyActor::BeginPlay()
{
    MyCVars::ExampleAutoConsoleVariable->OnChangedDelegate().AddWeakLambda(
        this,
        []
        (IConsoleVariable* CVar)
        {
            if (CVar != nullptr)
            {
                UE_LOG(LogTemp, Warning, TEXT("%d"), CVar->GetInt());
            }
        }
    );
}
```

In case you're in a different one:
```cpp
// AnyOtherFile.cpp

void AAnotherActor::BeginPlay()
{
    static IConsoleVariable* ExampleAutoConsoleVariable = IConsoleManager::Get().FindConsoleVariable(MyCVars::ExampleAutoConsoleVariableName);
    if (ExampleAutoConsoleVariableName != nullptr)
    {
        ExampleAutoConsoleVariable->OnChangedDelegate().AddWeakLambda(
            this,
            []
            (IConsoleVariable* CVar)
            {
                if (CVar != nullptr)
                {
                    UE_LOG(LogTemp, Warning, TEXT("%d"), CVar->GetInt());
                }
            }	
        );
    }
}
```

---

# References
- [Console Variables and Commands | Unreal Engine 5.7 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/console-variables-cplusplus-in-unreal-engine)
- [Console Variables Editor | Unreal Engine 5.7 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/console-variables-editor)
- [Unreal Console Variables - CVars : how create; set console, command line, or ini file - UE C++ | enigma tutorials](https://youtu.be/p3D86awRl1A)
