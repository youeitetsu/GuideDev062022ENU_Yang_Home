﻿namespace Terrasoft.Core.Process
{

	using System;
	using System.Collections.Generic;
	using System.Collections.ObjectModel;
	using System.Drawing;
	using System.Globalization;
	using System.Text;
	using Terrasoft.Common;
	using Terrasoft.Core;
	using Terrasoft.Core.Configuration;
	using Terrasoft.Core.DB;
	using Terrasoft.Core.Entities;
	using Terrasoft.Core.Process;
	using Terrasoft.Core.Process.Configuration;

	#region Class: UsrTestCSharpProcessMethodsWrapper

	/// <exclude/>
	public class UsrTestCSharpProcessMethodsWrapper : ProcessModel
	{

		public UsrTestCSharpProcessMethodsWrapper(Process process)
			: base(process) {
			AddScriptTaskMethod("ScriptTask1Execute", ScriptTask1Execute);
		}

		#region Methods: Private

		private bool ScriptTask1Execute(ProcessExecutingContext context) {
			var esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrRealty");
			var priceColumn = esq.AddColumn("UsrPriceUSD");  // select UsrPriceUSD as UsrPriceUSD, UsrAreaSqM as UsrAreaSqM from UsrRealty where ...
			var areaColumn = esq.AddColumn("UsrAreaSqM");
			
			Guid typeId = Get<Guid>("RealtyTypeId");
			Guid offerTypeId = Get<Guid>("RealtyOfferTypeId");
			//Guid typeId = new Guid("fdb20890-5ff4-4a58-b025-fa304fce2c95"); // Apartment realty type
			//Guid offerTypeId = new Guid("89bbf962-40e4-40bb-bb59-a4579cc2a3ba");  // Sales realty offer type
			
			var typeFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrType", typeId);
			esq.Filters.Add(typeFilter);
			
			var offerTypeFilter = esq.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrOfferType", offerTypeId);
			esq.Filters.Add(offerTypeFilter);
			
			var entityCollection = esq.GetEntityCollection(UserConnection);
			decimal totalUSD = 0;
			decimal totalArea = 0;
			foreach(var entity in entityCollection) {
					decimal price = entity.GetTypedColumnValue<decimal>(priceColumn.Name); // reading using column alias
					decimal area = entity.GetTypedColumnValue<decimal>(areaColumn.Name); // reading using column alias
					totalUSD = totalUSD + price;
					totalArea = totalArea + area;
			}
			
			decimal result = 0;
			if (totalArea > 0) {
					result = totalUSD / totalArea;
			}
			
			Set("AvgPriceUSD", result);
			
			return true;
		}

		#endregion

	}

	#endregion

}

