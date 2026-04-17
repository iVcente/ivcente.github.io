---
title: "DanzmannBitmasking"
date: "2025-08-02"
summary: "Simplifies bitmasks use in C++ and Blueprints by providing generic functions to most common operations."
tags: ["C++", "Unreal Engine"]
type: "Plugin"
cover: "https://images-assets.nasa.gov/image/PIA23647/PIA23647~large.jpg"
company: ""
companyWebsite: ""
teamSize: ""
period: ""
github: "https://github.com/iVcente/DanzmannBitmasking"
steam: ""
epicGamesStore: ""
website: ""
video: ""
videoDescription: ""
---

# Introduction

A plugin that simplifies bitmasks usage in C++ and Blueprints by providing generic functions to most common operations.
The following functions are available:
- `AddFlags()`;
- `RemoveFlags()`;
- `FlipFlags()`;
- `HasAllFlags()`;
- `HasAnyFlags()`.

More info on enums can be found on [Enums: What They Are, Where They Live, and How to Use Them](http://danzmann.dev/#/posts/enums-what-whey-are-where-they-live-and-how-to-use-them).

---

# Usage Example

## C++

> [!NOTE] Make sure you have added the `DanzmannBitmasking` module to your project's `Build.cs` file.

Create an enum that supports bitmasking:
```cpp:ElementalTrait.h
#pragma once

#include "ElementalTrait.generated.h"

/**
 * Example enum that using bitmasks can be useful.
 */
UENUM(BlueprintType, Meta = (Bitflags, UseEnumValuesAsMaskValuesInEditor = true))
enum class EElementalTrait : uint8
{
    None      = 0 UMETA(Hidden), // 0x00
    Fire      = 1,               // 0x01 // 1 << 0
    Frost     = 2,               // 0x02 // 1 << 1
    Lightning = 4,               // 0x04 // 1 << 2
    Poison    = 8                // 0x08 // 1 << 3
};

ENUM_CLASS_FLAGS(EElementalTrait)
ENUM_RANGE_BY_FIRST_AND_LAST(EElementalTrait, EElementalTrait::None, EElementalTrait::Poison)
```

Now, let's create an example Actor that'll make use of the enum and the plugin functions:
```cpp:ExampleActor.h

#pragma once

#include "CoreMinimal.h"
#include "DanzmannBitmaskingFunctionLibrary.h"
#include "ElementalTrait.h"
#include "GameFramework/Actor.h"

#include "ExampleActor.generated.h"

/**
 * Example Actor.
 */
UCLASS()
class MYPROJECT_API AExampleActor : public AActor
{
    GENERATED_BODY()

    public:
        /**
        * Get current elemental traits.
        * @return Actor's elemental traits.
        */
        UFUNCTION(BlueprintPure)
        int32 GetElementalTraits() const
        {
            return ElementalTraits;
        }

        /**
        * Set current elemental traits.
        * @param NewElementalTraits New elemental traits.
        */
        UFUNCTION(BlueprintCallable)
        void SetElementalTraits(UPARAM(Meta = (Bitmask, BitmaskEnum = "/Script/MyProject.ElementalTrait")) const int32 NewElementalTraits)
        {
            ElementalTraits = NewElementalTraits;
        }

    protected:
		/**
		 * @see more info in Actor.h.
		 */
		virtual void BeginPlay() override
		{
			Super::BeginPlay();

			// Set elemental traits as fire and lightning
			UDanzmannBitmaskingFunctionLibrary::AddFlags(ElementalTraits, EElementalTrait::Fire | EElementalTrait::Lightning);

			// Check if Actor has lightning or poison elemental traits
			bool bResult = UDanzmannBitmaskingFunctionLibrary::HasAnyFlags(ElementalTraits, EElementalTrait::Poison | EElementalTrait::Lightning);
		}

		/**
		 * Current elemental traits.
		 */
		UPROPERTY(BlueprintReadWrite, Meta = (Bitmask, BitmaskEnum = "/Script/MyProject.ElementalTrait"))
		int32 ElementalTraits = 0;
};
```

## BP

Create an enum that supports bitmasking by checking `Bitmask Flags`:
![BP Enum Bitmask Flags](/images/projects/danzmann-bitmasking/bp-enum-bitmask-flags.jpg "BP Enum Bitmask Flags")

Create an integer variable to store your flags. Then, check `Bitmask` and set the just created enum in `Bitmask Enum`:
![BP Integer Bitmask](/images/projects/danzmann-bitmasking/bp-integer-bitmask.jpg "BP Integer Bitmask")

Then just use the plugin functions, and use the node Make Bitmask to make your life easier:
![BP Functions](/images/projects/danzmann-bitmasking/bp-functions.jpg "BP Functions")
