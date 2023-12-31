// Code generated by mockery v2.36.0. DO NOT EDIT.

package utils

import mock "github.com/stretchr/testify/mock"

// MockUtils is an autogenerated mock type for the Utils type
type MockUtils struct {
	mock.Mock
}

type MockUtils_Expecter struct {
	mock *mock.Mock
}

func (_m *MockUtils) EXPECT() *MockUtils_Expecter {
	return &MockUtils_Expecter{mock: &_m.Mock}
}

// GenerateContentFileName provides a mock function with given fields: displayName, extension
func (_m *MockUtils) GenerateContentFileName(displayName string, extension string) string {
	ret := _m.Called(displayName, extension)

	var r0 string
	if rf, ok := ret.Get(0).(func(string, string) string); ok {
		r0 = rf(displayName, extension)
	} else {
		r0 = ret.Get(0).(string)
	}

	return r0
}

// MockUtils_GenerateContentFileName_Call is a *mock.Call that shadows Run/Return methods with type explicit version for method 'GenerateContentFileName'
type MockUtils_GenerateContentFileName_Call struct {
	*mock.Call
}

// GenerateContentFileName is a helper method to define mock.On call
//   - displayName string
//   - extension string
func (_e *MockUtils_Expecter) GenerateContentFileName(displayName interface{}, extension interface{}) *MockUtils_GenerateContentFileName_Call {
	return &MockUtils_GenerateContentFileName_Call{Call: _e.mock.On("GenerateContentFileName", displayName, extension)}
}

func (_c *MockUtils_GenerateContentFileName_Call) Run(run func(displayName string, extension string)) *MockUtils_GenerateContentFileName_Call {
	_c.Call.Run(func(args mock.Arguments) {
		run(args[0].(string), args[1].(string))
	})
	return _c
}

func (_c *MockUtils_GenerateContentFileName_Call) Return(_a0 string) *MockUtils_GenerateContentFileName_Call {
	_c.Call.Return(_a0)
	return _c
}

func (_c *MockUtils_GenerateContentFileName_Call) RunAndReturn(run func(string, string) string) *MockUtils_GenerateContentFileName_Call {
	_c.Call.Return(run)
	return _c
}

// GetExtension provides a mock function with given fields: mimeType
func (_m *MockUtils) GetExtension(mimeType string) (string, error) {
	ret := _m.Called(mimeType)

	var r0 string
	var r1 error
	if rf, ok := ret.Get(0).(func(string) (string, error)); ok {
		return rf(mimeType)
	}
	if rf, ok := ret.Get(0).(func(string) string); ok {
		r0 = rf(mimeType)
	} else {
		r0 = ret.Get(0).(string)
	}

	if rf, ok := ret.Get(1).(func(string) error); ok {
		r1 = rf(mimeType)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// MockUtils_GetExtension_Call is a *mock.Call that shadows Run/Return methods with type explicit version for method 'GetExtension'
type MockUtils_GetExtension_Call struct {
	*mock.Call
}

// GetExtension is a helper method to define mock.On call
//   - mimeType string
func (_e *MockUtils_Expecter) GetExtension(mimeType interface{}) *MockUtils_GetExtension_Call {
	return &MockUtils_GetExtension_Call{Call: _e.mock.On("GetExtension", mimeType)}
}

func (_c *MockUtils_GetExtension_Call) Run(run func(mimeType string)) *MockUtils_GetExtension_Call {
	_c.Call.Run(func(args mock.Arguments) {
		run(args[0].(string))
	})
	return _c
}

func (_c *MockUtils_GetExtension_Call) Return(_a0 string, _a1 error) *MockUtils_GetExtension_Call {
	_c.Call.Return(_a0, _a1)
	return _c
}

func (_c *MockUtils_GetExtension_Call) RunAndReturn(run func(string) (string, error)) *MockUtils_GetExtension_Call {
	_c.Call.Return(run)
	return _c
}

// NewMockUtils creates a new instance of MockUtils. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewMockUtils(t interface {
	mock.TestingT
	Cleanup(func())
}) *MockUtils {
	mock := &MockUtils{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
