---
title: "Asynchronously Loading Assets & Introduction to Asset Manager"
date: "2026-03-25"
summary: "A good way to asynchronously load assets is by using the Streamable Manager. However, an even better option might be the Asset Manager! Let's talk a bit about both."
tags: ["Code"]
---

# Introduction

A good way to asynchronously load assets is by using the Streamable Manager. However, an even better option might be the Asset Manager! Let's talk a bit about both.

---

# Streamable Manager

The Streamable Manager is a separate system to Asset Manager, but they're complementary. It performs the work of asynchronously loading objects and keeping them in memory via Streamable Handles until they are no longer needed and can be unloaded. It can be accessed through the Asset Manager.

We're interested in the `FStreamableManager::RequestAsyncLoad()` function. By using it, you get a few perks: request to load a bunch of assets at once, optionally get a callback to when they have been loaded, and get a Streamable Handle with all the loaded assets where its lifecycle is linked to the lifecycle of the loaded assets as well. Here's a few ways of using it: 

```cpp
// .h

UPROPERTY(EditAnywhere)
TSoftObjectPtr<UNiagaraSystem> AssetOne = nullptr;

UPROPERTY(EditAnywhere)
TSoftObjectPtr<UNiagaraSystem> AssetTwo = nullptr;

TSharedPtr<FStreamableHandle> StreamableHandle = nullptr;

// .cpp

void LoadStuff()
{
	// RequestAsyncLoad() expects an array of FSoftObjectPath
	TArray<FSoftObjectPath> AssetsToLoad;
	AssetsToLoad.Add(AssetOne.ToSoftObjectPath());
	AssetsToLoad.Add(AssetTwo.ToSoftObjectPath());
	
	// Remember that you can send additional stuff to the callback
	int32 MyOtherVar = 5;
	
	// Keep a reference to the Streamable Handle so assets remain loaded
	StreamableHandle = UAssetManager::GetStreamableManager().RequestAsyncLoad(
		AssetsToLoad,
		FStreamableDelegate::CreateUObject(this, &ThisClass::OnAssetsLoaded, MyOtherVar)
	);
}

void OnAssetsLoaded(int32 MyOtherVar)
{
	if (AssetOne.IsValid())
	{
		AssetOne.Get() // At this point, AssetOne should be valid
	}
}
```

```cpp
// .h

UPROPERTY(EditAnywhere)
TSoftObjectPtr<AActor> AssetThree = nullptr;

UPROPERTY()
TObjectPtr<Actor> LoadedAssetThree = nullptr;

// .cpp

// Instead of using Streamable Handle to keep loaded object alive, we'll use
// LoadedAssetThree on the callback. Otherwise, object will be garbage collected at some point
UAssetManager::GetStreamableManager().RequestAsyncLoad(
	{AssetThree.ToSoftObjectPath()},
	FStreamableDelegateWithHandle::CreateWeakLambda(
		this,
		[this]
		(TSharedPtr<FStreamableHandle> StreamableHandle)
		{
			// Access loaded asset and store a reference to it
			LoadedAssetThree = StreamableHandle->GetLoadedAsset<AActor>(); // There is GetLoadedAssets() as well!
		}
	)
);
```

---

# Asset Manager

The Asset Manager is a unique, global object that exists in the Editor and packaged games. It allows precise control over when assets are discovered, loaded, and audited.

The Asset management system in Unreal breaks all Assets into two types: Primary Assets and Secondary Assets. 

Primary Assets can be manipulated directly by the Asset Manager from their Primary Asset ID. 
Secondary Assets are not handled directly by the Asset Manager, but instead are loaded automatically by the Engine in response to being referenced or used by Primary Assets. By default, only `UWorld` Assets (levels) are Primary, all other Assets are Secondary. 

As mentioned, pretty much all Assets are Secondary by default, in order to make a Secondary Asset into a Primary Asset just override the `GetPrimaryAssetId()` function for its class to return a valid `FPrimaryAssetId` structure.

## Creating a Primary Asset

A Primary Asset ID (`FPrimaryAssetId`) uniquely identifies an object as a Primary Asset across the entire project, and has two parts:
- Primary Asset Type: it is a `FPrimaryAssetType`, and identifies a group of Assets;
- Primary Asset Name: it is a `FName`, and corresponds to a specific Primary Asset -- which defaults to the Asset's name as it appears in the Content Browser.
When converted to a string, a Primary Asset ID follows the given pattern: "Primary Asset Type:Primary Asset Name".

Although any object can be a Primary Asset, `UPrimaryDataAsset` already implements what it takes to be a Primary Asset. Let's take advantage of that to create a subclass named `UMyCustomPrimaryDataAsset` that inherits from it. Like so:

```cpp
// MyCustomPrimaryDataAsset.h

UCLASS()
class MYPROJECT_API UMyCustomPrimaryDataAsset : public UPrimaryDataAsset
{
	GENERATED_BODY()

	public:
		UPROPERTY(BlueprintReadOnly, EditDefaultsOnly, Meta = (AssetBundles = "MyBundle"))
		TSoftObjectPtr<UInputMappingContext> DefaultInputMappingContext = nullptr;

		UPROPERTY(BlueprintReadOnly, EditDefaultsOnly, Meta = (ForceInlineRow, AssetBundles = "MyBundle"))
		TMap<FGameplayTag, TSoftObjectPtr<USkeletalMesh>> SkeletalMeshes;
		
		UPROPERTY(BlueprintReadOnly, EditDefaultsOnly, Meta = (AssetBundles = "UI"))
		TArray<TSoftObjectPtr<UTexture2D>> Textures;
		
		UPROPERTY(BlueprintReadOnly, EditDefaultsOnly)
		TObjectPtr<AActor> SomeActor = nullptr;
		
		UPROPERTY(BlueprintReadOnly, EditDefaultsOnly)
		int32 SomeNumber = 0;
};
```

`UPrimaryDataAsset` establishes by default the following rules for its Primary Asset Type:
> The Primary Asset Type will be equal to the name of the first native class going up the hierarchy, or the highest level Blueprint class. For example, if you have `UPrimaryDataAsset` -> `UParentNativeClass` -> `UChildNativeClass` -> `DataOnlyBlueprintClass` the Primary Asset Type will be `ChildNativeClass`.
> 
> Whereas if you have `UPrimaryDataAsset` -> `ParentBlueprintClass` -> `DataOnlyBlueprintClass` the Primary Asset Type will be `ParentBlueprintClass`. To change this behavior, override `GetPrimaryAssetId()` in your native class or copy those functions into a different native base class.

Based on this, creating a data only Blueprint from `UMyCustomPrimaryDataAsset` called "DA_MyDataAsset" will result in its Primary Asset ID looking like "MyCustomPrimaryDataAsset:DA_MyDataAsset".

---

## Configuring Asset Manager

Following our example class, to allow the Asset Manager to successfully scan our Primary Asset, we require to do some setup. In `Project Settings > Asset Manager`, add the following entry to `Primary Asset Types to Scan`:
- Primary Asset Type: `MyCustomPrimaryDataAsset`;
- Asset Base Class: `UMyCustomPrimaryDataAsset` -- but `UPrimaryDataAsset` would work too;
- Directories: directory where to scan for the `UMyCustomPrimaryDataAssets`.

![Asset Manager Settings to Load Primary Asset](images/posts/asynchronously-loadings-assets-and-introduction-to-asset-manager/asset-manager-settings.png "Asset Manager Settings to Load Primary Asset")

To check if your setup is correct you can use the following commands:
- `AssetManager.DumpAssetDependencies`;
- `AssetManager.DumpBundlesForAsset {FPrimaryAssetId}`;
- `AssetManager.DumpLoadedAssets`;
- `AssetManager.DumpTypeSummary`;
- `AssetManager.LoadPrimaryAssetsWithType {FPrimaryAssetType}`;
- `AssetManager.UnloadPrimaryAssetsWithType {FPrimaryAssetType}`.

## Loading Primary Assets

There are two ways of loading Primary Assets: **Preload** and **Load**. Let's focus on `PreloadPrimaryAssets()` and `LoadPrimaryAssets()` functions -- just keep in mind that there are more variations for both ways!

Both functions have a return type of `TSharedPtr<FStreamableHandle>`. This handle can be useful for caching, accessing and releasing the loaded Primary Assets. 

Assets loaded with `LoadPrimaryAssets()` will remain in memory until explicitly released by the Asset Manager or by their handle -- and are not hard referenced by any other object of course.

Assets loaded with `PreloadPrimaryAssets()` must have their handle stored or be hard referenced. Otherwise, they will be released right away.

For loading a Primary Asset, that's all you need. In our example Data Asset, `SomeActor` and `SomeNumber` would be ready to use. Unlike `SomeActor` -- which is a `TObjectPtr` --, the other soft variables won't have their assets loaded immediately, and you would need to manually load them with Streamable Manager. 
To help us with this, Asset Manager has an amazing feature: the specifier `AssetBundles`. Add it as a `UPROPERTY` to soft member variables (Secondary Assets) of your Primary Asset. Both Preloading and Loading support passing an array of `FName` for Asset Bundles. For instance, passing "MyBundle" would result in not only loading the Primary Asset, but also loading any variables within it that are part of the Bundle called "MyBundle".

## Getting Primary Assets and Their Data

Here are some interesting functions the Asset Manager exposes to get Primary Assets and their related data:

```cpp
/*
 * Get the FAssetData for a Primary Asset with the specified Primary Asset ID. 
 * No need to have the UObject loaded in memory.
 * @note FAssetData contains information about an asset found by the Asset Registry.
 * @note It will only work if asset has been scanned already.
 */
bool UAssetManager::GetPrimaryAssetData(const FPrimaryAssetId& PrimaryAssetId, FAssetData& AssetData) const;

/*
 * Get a list of all FAssetData for a Primary Asset Type.
 * No need to have the UObject loaded in memory.
 */
bool UAssetManager::GetPrimaryAssetDataList(FPrimaryAssetType PrimaryAssetType, TArray<FAssetData>& AssetDataList) const;

/*
 * Get the UObject loaded in memory for a Primary Asset ID.
 * @note There is templated version of this function as well.
 */
UObject* UAssetManager::GetPrimaryAssetObject(const FPrimaryAssetId& PrimaryAssetId) const;

/*
 * Get the class of a UObject loaded in memory that maps to given Primary Asset ID.
 */
template<class AssetType>
TSubclassOf<AssetType> UAssetManager::GetPrimaryAssetObjectClass(const FPrimaryAssetId& PrimaryAssetId) const;

/*
 * Get a list of UObjects loaded in memory that are of given Primary Asset Type.
 */
bool UAssetManager::GetPrimaryAssetObjectList(FPrimaryAssetType PrimaryAssetType, TArray<UObject*>& ObjectList) const;

/*
 * Get the FSoftObjectPath of a a Primary Asset ID.
 * No need to have the UObject loaded in memory.
 */
FSoftObjectPath UAssetManager::GetPrimaryAssetPath(const FPrimaryAssetId& PrimaryAssetId) const;

/*
 * Get the list of all FSoftObjectPaths for a given Primary Asset Type.
 * No need to have the UObjects loaded in memory.
 */
bool UAssetManager::GetPrimaryAssetPathList(FPrimaryAssetType PrimaryAssetType, TArray<FSoftObjectPath>& AssetPathList) const;

/*
 * If given UObject is valid and is a registered Primary Asset, returns its Primary Asset ID.
 */
FPrimaryAssetId UAssetManager::GetPrimaryAssetIdForObject(UObject* Object) const;

/*
 * If given FSoftObjectPath is a registered Primary Asset, return its Primary Asset ID.
 * No need to have the UObject that the FSoftObjectPath represents lodaded in memory.
 */
FPrimaryAssetId UAssetManager::GetPrimaryAssetIdForPath(const FSoftObjectPath& ObjectPath) const;

/*
 * Get the list of all Primary Asset IDs for a Primary Asset Type.
 * No need to have the UObjects that are represented by the Primary Assets IDs loaded in memory. 
 */
bool UAssetManager::GetPrimaryAssetIdList(FPrimaryAssetType PrimaryAssetType, TArray<FPrimaryAssetId>& PrimaryAssetIdList, EAssetManagerFilter Filter = EAssetManagerFilter::Default) const;

/*
 * Return the loading handle associated with the Primary Asset given its Primary Asset ID.
 * The handle be checked for progress or waited on.
 */
TSharedPtr<FStreamableHandle> UAssetManager::GetPrimaryAssetHandle(const FPrimaryAssetId& PrimaryAssetId, bool bForceCurrent = false, TArray<FName>* Bundles = nullptr) const;

/*
 * Return a list of Primary Asset IDs that are in the given Bundle state. Only assets that are loaded or being loaded are valid.
 */
bool UAssetManager::GetPrimaryAssetsWithBundleState(TArray<FPrimaryAssetId>& PrimaryAssetList, const TArray<FPrimaryAssetType>& ValidTypes, const TArray<FName>& RequiredBundles, const TArray<FName>& ExcludedBundles = TArray<FName>(), bool bForceCurrent = false) const;

/*
 * Fill in a TMap with the pending/active loading state of every Primary Asset.
 */
void UAssetManager::GetPrimaryAssetBundleStateMap(TMap<FPrimaryAssetId, TArray<FName>>& BundleStateMap, bool bForceCurrent = false) const;
```

## Preloading, Loading, Unloading Assets & Changing Bundles State

Here are a bunch of functions the Asset Manager exposes to handle Preloading, Loading, Unloading, and changing Bundles state of Primary Assets:

```cpp
/*
 * Preload data for a set of Primary Assets given their Primary Asset IDs in 
 * a specific bundle state, and return a handle you must keep active.
 * These assets are not officially in a "Asset Manager's loaded objects list",
 * so Unload/ChangeBundleState will not affect them and if you release the
 * handle without otherwise Loading the assets -- or keeping a strong reference
 * to it somewhere -- they will be freed.
 */
TSharedPtr<FStreamableHandle> UAssetManager::PreloadPrimaryAssets(const TArray<FPrimaryAssetId>& AssetsToLoad, const TArray<FName>& LoadBundles, bool bLoadRecursive, FAssetManagerLoadParams&& LoadParams, UE::FSourceLocation Location = UE::FSourceLocation::Current());


/*
 * Load a list of Primary Assets. These assets will stay in memory until explicitly unloaded.
 * You can wait on the returned handle or poll as needed.
 * If there is no work to do, returned handle will be null and delegate will be called on completion.
 */
TSharedPtr<FStreamableHandle> UAssetManager::LoadPrimaryAssets(const TArray<FPrimaryAssetId>& AssetsToLoad, const TArray<FName>& LoadBundles, FAssetManagerLoadParams&& LoadParams, UE::FSourceLocation Location = UE::FSourceLocation::Current());

/*
 * Load a single Primary Asset. This asset will stay in memory until explicitly unloaded.
 * You can wait on the returned handle or poll as needed.
 * If there is no work to do, returned handle will be null and delegate will be called on completion.
 */
TSharedPtr<FStreamableHandle> UAssetManager::LoadPrimaryAsset(const FPrimaryAssetId& AssetToLoad, const TArray<FName>& LoadBundles, FAssetManagerLoadParams&& LoadParams, UE::FSourceLocation Location = UE::FSourceLocation::Current());

/*
 * Load all assets of a given Primary Asset Type. These assets will stay in memory until explicitly unloaded.
 * You can wait on the returned handle or poll as needed.
 * If there is no work to do, returned handle will be null and delegate will be called on completion.
 */
TSharedPtr<FStreamableHandle> UAssetManager::LoadPrimaryAssetsWithType(FPrimaryAssetType PrimaryAssetType, const TArray<FName>& LoadBundles, FAssetManagerLoadParams&& LoadParams, UE::FSourceLocation Location = UE::FSourceLocation::Current());

/*
 * Unload from the Asset Manager a list of Primary Assets that were previously
 * requested to Load (not Preload).
 * If the only thing keeping these assets in memory was a prior load call, they will be freed,
 * otherwise they will be cleared from memory once all strong references to it cease to exist.
 */
int32 UAssetManager::UnloadPrimaryAssets(const TArray<FPrimaryAssetId>& AssetsToUnload);

/* 
 * Unload from the Asset Manager a single Primary Asset that was previously
 * requested to Load (not Preload).
 * If the only thing keeping this asset in memory was a prior load call, it will be freed,
 * otherwise it will be cleared from memory once all strong references to it cease to exist.
 */
int32 UAssetManager::UnloadPrimaryAsset(const FPrimaryAssetId& AssetToUnload);

/* 
 * Unload from the Asset Manager all Primary Assets of a given Primary Asset Type that were
 * previously requested to Load (not Preaload).
 * If the only thing keeping this asset in memory was a prior load call, it will be freed,
 * otherwise it will be cleared from memory once all strong references to it cease to exist.
 */
int32 UAssetManager::UnloadPrimaryAssetsWithType(FPrimaryAssetType PrimaryAssetType);

/*
 * Change the bundle state of a set of Loaded (not Preloaded) Primary Assets
 * given their Primary Asset IDs.
 * You can wait on the returned handle or poll as needed.
 * If there is no work to do, returned handle will be null and delegate will get called on completion.
 */
TSharedPtr<FStreamableHandle> UAssetManager::ChangeBundleStateForPrimaryAssets(const TArray<FPrimaryAssetId>& AssetsToChange, const TArray<FName>& AddBundles, const TArray<FName>& RemoveBundles, bool bRemoveAllBundles, FAssetManagerLoadParams&& LoadParams, UE::FSourceLocation Location = UE::FSourceLocation::Current());

/*
 * Change the bundle state of all Loaded (not Preloaded) Primary Assets
 * matching OldBundles.
 * Primary Assets that don't match OldBundles will not be modified.
 * You can wait on the returned handle or poll as needed.
 * If there is no work to do, returned handle will be null and delegate will get called on completion.
 */
TSharedPtr<FStreamableHandle> UAssetManager::ChangeBundleStateForMatchingPrimaryAssets(const TArray<FName>& NewBundles, const TArray<FName>& OldBundles, FAssetManagerLoadParams&& LoadParams, UE::FSourceLocation Location = UE::FSourceLocation::Current());

/*
 * Load non Primary Assets with the Streamable Manager.
 * These assets will stay in memory until explicitly unloaded.
 */
TSharedPtr<FStreamableHandle> UAssetManager::LoadAssetList(TArray<FSoftObjectPath>&& AssetList, FAssetManagerLoadParams&& LoadParams, FString&& DebugName = FString(TEXT("LoadAssetList")), UE::FSourceLocation&& Location = UE::FSourceLocation::Current());
```

---

# References

- [Asset Manager Explained | Inside Unreal](https://youtu.be/9MGHBU5eNu0);
- [Unreal Engine - The Asset Manager, Primary Assets and Asset Bundles | Eric Friedman's Engineering Blog](https://www.jooballin.com/p/unreal-engine-the-asset-manager-primary);
- [Asset Manager for Data Assets & Async Loading | Tom Looman](https://www.tomlooman.com/unreal-engine-asset-manager-async-loading/);
- [Asset Management | Unreal Engine 5.6 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-management-in-unreal-engine).
