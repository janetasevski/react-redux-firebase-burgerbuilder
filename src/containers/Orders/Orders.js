import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {

    componentDidMount() {
        this.props.onInit();
        // axios.get('/orders.json')
        //     .then(res => {
        //         const fetchedOrders = [];
        //         for (let key in res.data) {
        //             fetchedOrders.push({
        //                 ...res.data[key],
        //                 id: key
        //             });
        //         }
        //         this.setState({loading: false, orders: fetchedOrders});
        //     })
        //     .catch(err => {
        //         this.setState({loading: false});
        //     });
    }

    render () {
        let ordersToShow = !this.props.loading 
            ? this.props.orders.map(order => (
                <Order 
                    key={order.id}
                    ingredients={order.ingredients}
                    price={order.price} />
            ))
            : <Spinner />
            
        return (
            <div>
                {ordersToShow}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.or.orders,
        loading: state.or.loading,
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInit: () => dispatch(actions.fetchOrders())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));