interface Constructable<T> {
	new (...args: ConstructorParameters<T>): InstanceType<T>
}

type DateType = number | string | Date