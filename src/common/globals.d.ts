interface Constructable<T> {
	new (...args: ConstructorParameters<T>): InstanceType<T>
}