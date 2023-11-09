declare type TargetedEvent<
	Target extends EventTarget = EventTarget,
	TypedEvent extends Event = Event
> = Omit<TypedEvent, "currentTarget" | "target"> & {
	readonly currentTarget: Target;
	readonly target: Target;
};
