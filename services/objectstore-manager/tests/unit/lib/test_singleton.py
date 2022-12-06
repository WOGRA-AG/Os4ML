from lib.singleton import Singleton


def test_singleton():
    class TestClass(metaclass=Singleton):
        pass

    assert id(TestClass()) == id(TestClass())
