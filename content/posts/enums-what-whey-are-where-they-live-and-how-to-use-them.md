---
title: "Enums: What They Are, Where They Live, and How to Use Them"
date: "2026-04-05"
summary: "All about enums!"
tags: ["Code"]
---

# Introduction

Replacing the old `TEnumAsByte<>` workaround, and supported by `UPROPERTY` are `enum class`. They're much useful for listing a set of values and their respective names, performing bitwise operations, and sending data through the network. They also come with a bunch of quality of life helpers.

Enums can be defined as such:
```cpp
// Thing.h

#pragma once

#include "Thing.generated.h"

UENUM()
enum class EThing : uint8
{
    HideThis UMETA(Hidden), // You can use UMETA(Hidden) to prevent a value of showing up in the Editor.
    Thing1,
    Thing2
}

// MyActor.cpp

#include "Thing.h"

UPROPERTY()
EThing MyProperty;
```

> [!WARNING] While C++ enums can be of any size, enums exposed to Blueprint must continue to be based on `uint8`.

---

# Creating a Bitmask and Setting Up Bitwise Operations

Basically, bitmask enums are a way of organizing a collection of flags or states. Think of it as a collection of booleans where you don't have to keep track of a dozen of different variables, they can be bundled up together in just a single one. They're fast and compact, so for network optimization is a big plus.

The amount of different states you can store inside of one integer depends on its memory size -- e.g., a 32 bit integer could hold 32 different states at once, one bit to represent each state. Use the `ENUM_CLASS_FLAGS(EnumType)` macro to automatically define all the bitwise operators, so we can check and set values for the states.

Creating an enum for a bitmask requires keeping a few things in mind:
- Include a `None` value set to `0` for proper comparisons;
- Initialize values using decimal, hexadecimal, or bit shift operators;
- Ensure each value is a power of 2;
- Add the `Bitflags` and `UseEnumValuesAsMaskValuesInEditor` `UPROPERTY` meta specifiers.

Putting it all together, it should look like this:
```cpp
// ExampleEnum.h

#pragma once

#include "ExampleEnum.generated.h"

UENUM(BlueprintType, Meta = (Bitflags, UseEnumValuesAsMaskValuesInEditor = true))
enum class EExampleEnum : uint8
{
    None      = 0 UMETA(Hidden), // 0x00
    Fire      = 1,               // 0x01 // 1 << 0
    Frost     = 2,               // 0x02 // 1 << 1
    Lightning = 4,               // 0x04 // 1 << 2
    Poison    = 8                // 0x08 // 1 << 3
};

ENUM_CLASS_FLAGS(EExampleEnum)

// MyActor.cpp

UPROPERTY(BlueprintReadWrite, Meta = (Bitmask, BitmaskEnum = "/Script/MyModuleName.EExampleEnum"))
int32 Debuffs = 0;
```

> [!NOTE] If you'd like to create the bitmask variable `Debuffs` directly on Blueprint, rather than creating the variable as the enum itself (`EExampleEnum`), you first create it as an integer, mark it as a `Bitmask`, then select its enum type from the details panel.

Performing bitwise operations -- adding/setting, removing/unsetting, flipping, checking set values -- is fairly simple:
```cpp
// Add/set flags
Debuffs |= (static_cast<int32>(EExampleEnum::Fire | EExampleEnum::Lightning));

// Remove/unset flags
Debuffs &= ~(static_cast<int32>(EExampleEnum::Fire));

// Flip flags
Debuffs ^= (static_cast<int32>(EExampleEnum::Lightning));

// Has all flags added/set?
EnumHasAllFlags(static_cast<TEnum>(Debuffs), EExampleEnum::Fire | EExampleEnum::Lightning);

// Has any of the flags added/set?
EnumHasAnyFlags(static_cast<TEnum>(Debuffs), EExampleEnum::Fire | EExampleEnum::Lightning | EExampleEnum::Poison);
```

I wrote a plugin named [DanzmannBitmasking](https://danzmann.dev/#/projects/danzmann-bitmasking) with a few helpers -- for C++ and BP -- to abstract these operations.

---

# Iterating Over Enum Values

Unreal provides three equivalent macros that allow iterating over the values of an enum:

## ENUM_RANGE_BY_COUNT

You need add a new value to the *end* of your enum -- it can be called anything, but `Count` is a good standard to use. After that, add `ENUM_RANGE_BY_COUNT` while passing the name of the enum and the amount of values it (thus why we added `Count`, so you don't hardcode a numbers).
```cpp
UENUM()
enum class EAnimal : uint8
{
	Cat,
	Dog,
	Elephant,
	Count UMETA(Hidden)
};

ENUM_RANGE_BY_COUNT(EAnimal, EAnimal::Count);
```

## ENUM_RANGE_BY_FIRST_AND_LAST

Unlike the methodd above, perhaps we don't want to add an extra value to our enum. Again, add the macro after the enum definition, but in this case, pass in the first and last entries of the enum.
```cpp
UENUM()
enum class EMilkshake : uint8
{
	Chocolate,
	Vanilla,
	Strawberry,
	Blueberry
};

ENUM_RANGE_BY_FIRST_AND_LAST(EMilkshake, EMilkshake::Chocolate, EMilkshake::Blueberry);
```

## ENUM_RANGE_BY_VALUES

Useful for defining iteration over an enum with a non-contiguous range of values. Pass in every value in the enum, in order.

```cpp
UENUM()
enum class ERandomValuesThing : uint8
{
	First  = 2,
	Second = 3,
	Third  = 5,
 	Fourth = 7,
 	Fifth  = 11
};

ENUM_RANGE_BY_VALUES(ERandomValuesThing, ERandomValuesThing::First, ERandomValuesThing::Second, ERandomValuesThing::Third, ERandomValuesThing::Fourth, ERandomValuesThing::Fifth)
```

## Iterating

No matter which macro's been chosen, iterating through the values of an enum is the same:
```cpp
for (EAnimal Animal : TEnumRange<EAnimal>())
{

}
```

---

# Helpers

Here are more helpers for when dealing with enums:

## Get Enum Value as a String

```cpp
UEnum::GetValueAsString(EExampleEnum::Fire);
```

## Conversions between enums and integers

Remember that enums are just disguised integers, so you can take advantage of that on converting one to another:
```cpp
// Enum to integer
static_cast<uint8>(EExampleEnum::Fire);

// Integer to enum
static_cast<EExampleEnum>(Debuffs);
```
---

# References

- [Strongly-Typed Enums | Unreal Engine 5.3 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine#strongly-typedenums);
- [Integers as Bitmasks | Unreal Engine 5.3 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-uproperties#asbitmasks);
- [Bitmask/Bitflag Enums | Unreal Engine Community Wiki](https://scylardor.fr/2020/09/02/unreal-engine-tips-c-bitflags-enums/);
- [Unreal Engine Tips - C++ Bitflags Enums | Le Scylardor](https://www.tomlooman.com/unreal-engine-asset-manager-async-loading/);
- [Using bitflags in C++ | Dieter's Dumping Grounds](https://tackytortoise.github.io/2020/11/26/using-bitflags-in-cpp.html);
- [Bitflags in Unreal C++ | Jake's Blog](https://duroxxigar.github.io/unreal/Bitflags-In-Unreal-C++/);
- [Iterating over UENUM with TEnumRange | Unreal Garden](https://unreal-garden.com/tutorials/iterate-over-enum-tenumrange/);
- [Using Enums and BitFlags in Unreal Game Development | GGameDev](https://www.youtube.com/watch?v=TuHFeS_eBe8);
