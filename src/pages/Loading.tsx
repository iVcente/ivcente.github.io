const Loading = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
            <div className="w-12 h-12 rounded-full border-4 border-muted border-t-primary animate-spin mb-6" />
            <p className="font-mono text-sm text-muted-foreground tracking-widest">LOADING</p>
        </div>
    );
};

export default Loading;
