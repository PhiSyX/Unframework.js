declare interface ObjectConstructor {
	entries<
		T extends {
			[Key in keyof T]: T[Key];
		},
		Entries extends Array<
			{
				[K in keyof Required<T>]: [K, Required<T>[K]];
			}[keyof T]
		>
	>(
		obj: T
	): Entries;
}
